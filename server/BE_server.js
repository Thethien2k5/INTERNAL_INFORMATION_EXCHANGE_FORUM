const express = require("express");
const https = require("https");
const { Server } = require("socket.io");
const cors = require("cors"); // Thư viện cho phép truy cập từ các nguồn khác nhau
const path = require("path");
const fs = require("fs");


// --------------------Import các module cần thiết--------------------
const otpRoutes = require("./router/RegisterAndSendEmail.js");
const loginRoutes = require("./router/Repair_Login.js");
const {initializeSocket} = require("./socket.js"); // Import hàm khởi tạo Socket.IO
const createFileRouter = require("./router/fileRouter.js"); // Import router để xử lý upload file

// --------------------Khởi tạo--------------------
const app = express();
// --------------------Cấu hình CORS--------------------
const corsOptions = {
  origin: "https://localhost:5500", // Cho phép truy cập từ địa chỉ này
  credentials: true // Cho phép gửi cookie và thông tin xác thực
};

app.use(cors());
app.use(express.json());


// --------------------Cấu hình HTTPS & chứng chỉ SSL/TLS---------------------
let httpsServer; // Biến để lưu trữ server HTTPS
const certDir =  path.join(__dirname, "certs");
const keyPath = path.join(certDir, "server.key");
const certPath = path.join(certDir, "server.cert");
// Kiểm tra xem thư mục certs đã tồn tại chưa, nếu chưa thì tạo mới
if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  // Mảng chứ "key" và "cert" để làm tham số tạo server HTTPS
  const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };
  // Tạo server HTTPS
  httpsServer = https.createServer(httpsOptions, app);
  console.log("Đã khởi tạo server HTTPS.");
}
else {
  // server = http.createServer(app);// Nếu không có chứng chỉ, sử dụng HTTP
  // console.log("Chứng chỉ SSL/TLS không tồn tại. Sử dụng HTTP.");
  console.error("Chứng chỉ SSL/TLS không tồn tại. Vui lòng tạo chứng chỉ trước bằng cách chạy 'node createCert.js'.");
  process.exit(1); // Dừng chương trình nếu không có chứng chỉ
}



// --------------------Khởi tạo Server---------------------
//const PORT = process.env.PORT || 5000; //// Nào up lên môi trường thì dùng
const BE_PORT = 5000;
httpsServer.listen(BE_PORT, () => {
  console.log(`BE_Server đang chạy trên cổng ${BE_PORT}`);
});


// --------------------Khởi tạo Socket.IO--------------------
const io = new Server(httpsServer, {
  cors: {
    origin: "https://localhost:5500", // Cho phép truy cập từ địa chỉ này
    methods: ["GET", "POST"],
  }
});
initializeSocket(io); // Gọi hàm khởi tạo Socket.IO để thiết lập các sự kiện


// --------------------Thiết lập sử dụng router-------------------
const fileRouter = createFileRouter(io); // Truyền io vào router file để có thể gửi các sự kiện realtime
app.use("/api", otpRoutes);
app.use("/api", loginRoutes);// Sử dụng router để xử lý upload file
app.use("/api", fileRouter); // Sử dụng router để xử lý upload file

// --------------------Xử lý lỗi--------------------
httpsServer.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Cổng BE_Server ${BE_PORT} đã được sử dụng. Vui lòng chọn cổng khác.`);
  }
  else {
    console.error("Lỗi khi khởi tạo BE_Server:", err);
  }
});

// Ở một số môi trường (hệ điều hành), các cổng từ 0 -> 1024 thường được dành riêng cho các dịch vụ hệ thống.
// Các cổng đặc quyền ấy thường được gọi là "privileged ports" hay "well-known ports".
// Vì vậy, nếu muốn chạy các Port 80 (HTTP) hoặc 443 (HTTPS) trên hệ thống,
//  cần có quyền quản trị (root) hoặc sử dụng các công cụ như "setcap" để cấp quyền cho Node.js.
