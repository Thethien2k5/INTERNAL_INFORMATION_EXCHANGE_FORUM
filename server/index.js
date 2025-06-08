const express = require("express");
const https = require("https");
const { Server } = require("socket.io");
const cors = require("cors"); // Thư viện cho phép truy cập từ các nguồn khác nhau
const path = require("path");
const fs = require("fs");

// --------------------Import các module cần thiết--------------------
const otpRoutes = require("./router/otp_server.js");
const loginRoutes = require("./router/Repair_Login.js");
const initializeSocket = require("./socket"); // Import hàm khởi tạo Socket.IO

// --------------------Khởi tạo--------------------
const app = express();
app.use(cors());
app.use(express.json());

// --------------------Cấu hình HTTPS & chứng chỉ SSL/TLS---------------------
const certDir =  path.join(__dirname, "certs");
let server;
const keyPath = path.join(certDir, "server.key");
const certPath = path.join(certDir, "server.cert");
// Kiểm tra xem thư mục certs đã tồn tại chưa, nếu chưa thì tạo mới
if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  // Mảng chứ "key" và "cert" để làm tham số tạo server HTTPS
  const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };
  server = https.createServer(httpsOptions, app);
  console.log("Đã khởi tạo server HTTPS.");
}
else {
  // Nếu không có chứng chỉ, sử dụng HTTP
  // server = http.createServer(app);
  // console.log("Chứng chỉ SSL/TLS không tồn tại. Sử dụng HTTP.");

  console.error("Chứng chỉ SSL/TLS không tồn tại. Vui lòng tạo chứng chỉ trước.");
}
// --------------------Thiết lập sử dụng router--------------------
// ! Chưa sử dụng: const fileRouter = createFileRouter(io); 
app.use("/api", otpRoutes);
app.use("/api", loginRoutes);

// --------------------Khởi tạo Server---------------------
//const PORT = process.env.PORT || 5000; //// Nào up lên môi trường thì dùng
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});


// Ở một số môi trường (hệ điều hành), các cổng từ 0 -> 1024 thường được dành riêng cho các dịch vụ hệ thống.
// Các cổng đặc quyền ấy thường được gọi là "privileged ports" hay "well-known ports".
// Vì vậy, nếu muốn chạy các Port 80 (HTTP) hoặc 443 (HTTPS) trên hệ thống,
//  cần có quyền quản trị (root) hoặc sử dụng các công cụ như "setcap" để cấp quyền cho Node.js.
