const express = require("express");
const app = express();
const https = require("https");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors"); // Thư viện cho phép truy cập từ các nguồn khác nhau
const path = require("path");
const fs = require("fs");

// --------------------Import các module cần thiết--------------------
const otpRoutes = require("./otp_server");
const loginRoutes = require("./Repair_Login");
const initializeSocket = require("./socket"); // Import hàm khởi tạo Socket.IO
// -------------------------------------------------------------------

// --------------------Cấu hình CORS--------------------
app.use(express.json());
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
