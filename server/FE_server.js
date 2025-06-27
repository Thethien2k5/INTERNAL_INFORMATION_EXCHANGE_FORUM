// server/FE_server.js

const express = require("express");
const path = require("path");
const fs = require("fs");
const https = require("https");

const { FE_PORT, getLocalIP } = require("./config.js");
const { router: checkAndGetDataRouter } = require("./router/CheckAndGetData");
const { router: SetDataRouter } = require("./router/SetData");

const app = express();
app.use(express.json());

// --- Cấu hình API Routes ---
app.use("/api", checkAndGetDataRouter);
app.use("/api", SetDataRouter);

// --- Cấu hình phục vụ File Tĩnh ---

// Phục vụ các tài nguyên như CSS, JS, ảnh từ thư mục 'static'
app.use('/templates/static', express.static(path.join(__dirname, '..', 'templates', 'static')));

// Khi người dùng truy cập /login, chúng ta sẽ trả về file login.html
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'templates', 'web', 'login.html'));
});
//Để có infor có thể tìm được ảnh hiển thị lên (frond end)
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads", "AvatarsUser"))
);

// Route ảo /pages để phục vụ các file HTML con
const webPagesPath = path.join(__dirname, '..', 'templates', 'web');
app.use('/pages', express.static(webPagesPath, { extensions: ['html'] }));



// Bất kỳ yêu cầu nào không phải là API hoặc file tĩnh sẽ được trả về file index.html chính
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'templates', 'web', 'index.html'));
});

// --- Cấu hình HTTPS và Khởi tạo Server (Giữ nguyên phần còn lại) ---
// ... (giữ nguyên code từ đây trở xuống)
let httpsServer;
const certDir = path.join(__dirname, "certs");
const keyPath = path.join(certDir, "server.key");
const certPath = path.join(certDir, "server.cert");

if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  // Mảng chứ "key" và "cert" để làm tham số tạo server HTTPS
  const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
  // Tạo server HTTPS
  httpsServer = https.createServer(httpsOptions, app);
  console.log("Đã khởi tạo server HTTPS.");
} else {
  // server = http.createServer(app);// Nếu không có chứng chỉ, sử dụng HTTP
  // console.log("Chứng chỉ SSL/TLS không tồn tại. Sử dụng HTTP.");
  console.error(
    "Chứng chỉ SSL/TLS không tồn tại. Vui lòng tạo chứng chỉ trước bằng cách chạy 'node createCert.js'."
  );
  process.exit(1); // Dừng chương trình nếu không có chứng chỉ
}

// --------------------Khởi tạo Server---------------------
httpsServer.listen(FE_PORT, "0.0.0.0", () => {
  console.log("FE_Server đã khởi động thành công!");
  const localIP = getLocalIP();
  localIP.forEach((ip) => {
    console.log(`     - https://${ip}:${FE_PORT}`);
  });
});

httpsServer.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Cổng FE_Server ${FE_PORT} đã được sử dụng. Vui lòng chọn cổng khác.`
    );
  } else {
    console.error("Lỗi khi khởi tạo FE_Server:", err);
  }
});
