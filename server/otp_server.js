const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const fs = require("fs").promises; // Để đọc tệp không đồng bộ
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
require("dotenv").config(); // Vẫn hữu ích cho các biến env tiềm năng khác

const app = express();

// --- Gmail API Configuration ---
const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];
const TOKEN_PATH = path.join(__dirname, "token.json");
const CREDENTIALS_PATH = path.join(__dirname, "credentials.json"); // Hãy chắc chắn rằng tập tin này tồn tại

/**
 * Tải hoặc yêu cầu hoặc ủy quyền để gọi API.
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Tuần tự hóa thông tin xác thực vào tệp tương thích với GoogleAUth.fromJSON.
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Tải ứng dụng khách Oauth2 với thông tin xác thực được cung cấp.
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

// Đối tượng dịch vụ Gmail toàn cầu
let gmailService;
authorize()
  .then((auth) => {
    gmailService = google.gmail({ version: "v1", auth });
    console.log("API Gmail đã được ủy quyền và dịch vụ đã được tạo.");
  })
  .catch((err) => {
    console.error("Failed to authorize Gmail API:", err);
    console.error(
      "Hãy đảm bảo 'credentials.json' được thiết lập chính xác và bạn đã cấp quyền cho ứng dụng."
    );
    // process.exit(1); // Tùy chọn thoát nếu xác thực Gmail quan trọng
  });

// --- Kết thúc cấu hình API Gmail ---

// Cấu hình CORS chi tiết
app.use(
  cors({
    origin: "*", // Cho phép tất cả các origin trong môi trường phát triển
    methods: ["GET", "POST"], // Cho phép các phương thức HTTP
    allowedHeaders: ["Content-Type", "Accept"], // Cho phép các headers
  })
);

// Lưu trữ thời gian gửi OTP gần nhất cho mỗi email
const otpTimestamps = new Map();
const OTP_COOLDOWN = 60 * 1000; // 60 giây tính bằng milliseconds

// Middleware để log tất cả các request
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware để phân tích body của request
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Phục vụ file tĩnh từ thư mục templates
// Giả sử logoT3V.png nằm trong thư mục templates hoặc thư mục gốc dự án.
// Điều chỉnh đường dẫn này nếu logo của bạn nằm ở nơi khác.
// Đối với email, sẽ đọc ảnh từ đường dẫn tương đối với script.
const LOGO_FILE_PATH = path.join(__dirname, "..", "templates", "static", "images", "logoT3V.png"); // Hoặc vị trí khác của logo
app.use("/templates", express.static(path.join(__dirname, "..", "templates")));
app.use(
  "/static",
  express.static(path.join(__dirname, "..", "static"))
); // Nếu logo nằm trong thư mục static

// Route chính - trả về login.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "templates", "login.html"));
});

/**
 * Tạo MIME message cho Gmail API với file đính kèm dạng inline.
 * @param {string} senderEmail Địa chỉ email người gửi (đã xác thực).
 * @param {string} toEmail Địa chỉ email người nhận.
 * @param {string} subject Tiêu đề email.
 * @param {string} htmlContent Nội dung HTML của email.
 * @param {string} attachmentFilePath Đường dẫn tới file ảnh để đính kèm inline.
 * @param {string} contentId Content-ID cho ảnh inline (ví dụ: 'logoT3V').
 * @returns {Promise<string>} Email đã được mã hóa base64url.
 */
async function createMessageWithAttachment(
  senderEmail,
  toEmail,
  subject,
  htmlContent,
  attachmentFilePath,
  contentId
) {
  const boundary = "----=_Part_Boundary_123456789.987654321";
  const alternativeBoundary = "----=_Alternative_Boundary_123456789.987654321";

  let emailBody = [];
  emailBody.push(`From: T3V <${senderEmail}>`); // Hiển thị tên "T3V"
  emailBody.push(`To: ${toEmail}`);
  emailBody.push(`Subject: =?utf-8?B?${Buffer.from(subject).toString("base64")}?=`); // Mã hóa tiêu đề cho ký tự không phải ASCII
  emailBody.push("MIME-Version: 1.0");
  emailBody.push(`Content-Type: multipart/related; boundary="${boundary}"`);
  emailBody.push("");
  emailBody.push(`--${boundary}`);
  emailBody.push(`Content-Type: multipart/alternative; boundary="${alternativeBoundary}"`);
  emailBody.push("");
  emailBody.push(`--${alternativeBoundary}`);
  emailBody.push("Content-Type: text/html; charset=utf-8");
  emailBody.push("Content-Transfer-Encoding: base64");
  emailBody.push("");
  emailBody.push(Buffer.from(htmlContent, "utf-8").toString("base64"));
  emailBody.push("");
  emailBody.push(`--${alternativeBoundary}--`);
  emailBody.push("");

  // Đính kèm ảnh
  try {
    const imageContent = await fs.readFile(attachmentFilePath);
    const base64Image = imageContent.toString("base64");
    const imageMimeType = path.extname(attachmentFilePath).toLowerCase() === ".png" ? "image/png" : "image/jpeg";

    emailBody.push(`--${boundary}`);
    emailBody.push(`Content-Type: ${imageMimeType}`);
    emailBody.push("Content-Transfer-Encoding: base64");
    emailBody.push(`Content-ID: <${contentId}>`);
    emailBody.push("Content-Disposition: inline"); // Không cần tên file cho inline
    emailBody.push("");
    emailBody.push(base64Image);
    emailBody.push("");
  } catch (err) {
    console.error("Lỗi khi đính kèm ảnh:", err);
    // Quyết định gửi email không có ảnh hoặc báo lỗi
  }

  emailBody.push(`--${boundary}--`);

  const rawEmail = emailBody.join("\r\n");
  return Buffer.from(rawEmail).toString("base64url");
}

// API endpoint để gửi OTP
app.post("/api/send-otp", async (req, res) => {
  console.log("Nhận yêu cầu gửi OTP:", req.body);

  if (!gmailService) {
    return res.status(503).json({
      success: false,
      message: "Dịch vụ email chưa sẵn sàng. Vui lòng thử lại sau.",
    });
  }

  const { email, username, otp } = req.body;

  if (!email || !username || !otp) {
    console.error("Thiếu trường bắt buộc:", { email, username, otp });
    return res.status(400).json({
      success: false,
      message: "Thiếu trường bắt buộc",
      received: req.body,
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error("Định dạng email không hợp lệ:", email);
    return res.status(400).json({
      success: false,
      message: "Định dạng email không hợp lệ",
    });
  }

  const lastSentTime = otpTimestamps.get(email);
  const now = Date.now();
  if (lastSentTime && now - lastSentTime < OTP_COOLDOWN) {
    const remainingTime = Math.ceil(
      (OTP_COOLDOWN - (now - lastSentTime)) / 1000
    );
    return res.status(429).json({
      success: false,
      message: `Vui lòng đợi ${remainingTime} giây trước khi gửi lại mã OTP`,
      remainingTime,
    });
  }

  // Email người gửi sẽ là email đã xác thực qua token.json
  // Đối với header "From", có thể set nhưng Gmail thường sẽ dùng user đã xác thực.
  // Lấy email của user đã xác thực.
  let senderEmailAddress = "thiennt4951@ut.edu.vn"; // hoặc email mặc định của bạn

  try {
    const profile = await gmailService.users.getProfile({ userId: "me" });
    senderEmailAddress = profile.data.emailAddress || senderEmailAddress;
  } catch (error) {
    console.warn("Không lấy được email người gửi, dùng mặc định. Lỗi:", error.message);
  }

  // Nội dung HTML động
  const subject = "Xác thực tài khoản Diễn đàn T3V"; // Tiêu đề
  const html_content = `
  <!DOCTYPE html>
  <html lang="vi">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Xác thực tài khoản Diễn đàn t3v</title>
      <style>
          body { font-family: 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; color: #333333; }
          .email-container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow: hidden; }
          .email-header { background-color: #7494ec; color: #ffffff; padding: 30px 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }
          .logoT3V { width: 100px; height: auto; margin-bottom: 15px; }
          .email-header h1 { margin: 0; font-size: 28px; font-weight: bold; }
          .email-body { padding: 30px 25px; line-height: 1.6; font-size: 16px; }
          .email-body p { margin-bottom: 15px; }
          .otp-code { display: inline-block; background-color: #e9ecef; color: #7494ec; font-size: 24px; font-weight: bold; padding: 12px 25px; border-radius: 5px; letter-spacing: 3px; margin: 20px 0; border: 1px dashed #7494ec; }
          .cta-button { display: inline-block; background-color: #28a745; color: #ffffff !important; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; margin-top: 15px; transition: background-color 0.3s ease; }
          .cta-button:hover { background-color: #218838; }
          .email-footer { background-color: #f8f9fa; color: #6c757d; padding: 20px; text-align: center; font-size: 12px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; }
          .email-footer p { margin: 5px 0; }
          .highlight { color: #7494ec; font-weight: bold; }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="email-header">
              <img class="logoT3V" src="cid:logoT3V" alt="Logo Diễn đàn t3v">
              <h1>Xác Thực Tài Khoản Của Bạn</h1>
          </div>
          <div class="email-body">
              <p>Xin chào ${username},</p>
              <p>Chào mừng bạn đến với cộng đồng <span class="highlight">Diễn đàn T3V</span>! Để hoàn tất quá trình đăng ký và đảm bảo an toàn cho tài khoản của bạn, vui lòng sử dụng mã OTP dưới đây:</p>
              <p style="text-align: center;">
                  <span class="otp-code">${otp}</span>
              </p>
              <p>Mã OTP này sẽ có hiệu lực trong vòng <span class="highlight">10 phút</span>. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
              <p>Nếu bạn không yêu cầu mã này, có thể ai đó đã cố gắng truy cập vào tài khoản của bạn. Vui lòng bỏ qua email này hoặc liên hệ với chúng tôi nếu bạn có bất kỳ lo ngại nào.</p>
              <p>Để quay lại diễn đàn và tiếp tục, bạn có thể nhấp vào nút bên dưới:</p>
              <p style="text-align: center;">
                  <a href="[Đường dẫn đến diễn đàn của bạn]" class="cta-button">Truy Cập Diễn Đàn T3V</a>
              </p>
              <p>Cảm ơn bạn đã tham gia! Chúng tôi rất vui khi có bạn là một phần của cộng đồng.</p>
          </div>
          <div class="email-footer">
              <p>Trân trọng,</p>
              <p><strong>Ban quản trị Diễn đàn T3V</strong></p>
              <p>&copy; ${new Date().getFullYear()} Diễn đàn T3V. Bảo lưu mọi quyền.</p>
              <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua địa chỉ ${senderEmailAddress}.</p>
          </div>
      </div>
  </body>
  </html>`;

  try {
    console.log("Đang gửi email tới:", email, "từ:", senderEmailAddress);
    const rawMessage = await createMessageWithAttachment(
      senderEmailAddress,
      email, // người nhận
      subject,
      html_content,
      LOGO_FILE_PATH, // <-- Đường dẫn mới
      "logoT3V" // Content-ID
    );

    await gmailService.users.messages.send({
      userId: "me", // 'me' là user đã xác thực
      requestBody: {
        raw: rawMessage,
      },
    });

    otpTimestamps.set(email, now);
    console.log("Gửi email thành công tới:", email);
    res.json({
      success: true,
      message: "OTP đã được gửi thành công qua Gmail",
      cooldown: OTP_COOLDOWN / 1000,
    });
  } catch (error) {
    console.error("Lỗi khi gửi email qua Gmail:", error);
    res.status(500).json({
      success: false,
      message: "Gửi OTP qua Gmail thất bại",
      error: error.message,
      details: error.response ? error.response.data : null,
    });
  }
});

// Xử lý 404 - Không tìm thấy file
app.use((req, res, next) => {
  console.log("404 - Không tìm thấy file:", req.url);
  res.status(404).send("404 - Không tìm thấy file");
});

// Xử lý lỗi server
app.use((err, req, res, next) => {
  console.error("Lỗi server:", err);
  res.status(500).send("500 - Lỗi server");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
  console.log(`Mở http://localhost:${PORT} trên trình duyệt`);
  console.log(
    "Đảm bảo 'credentials.json' nằm cùng thư mục với script."
  );
  console.log(
    "Lần chạy đầu tiên, bạn cần xác thực qua link được cung cấp trên console."
  );
});