const express = require("express");
const path = require("path");
const fs = require("fs");
const https = require("https");

const { FE_PORT, getLocalIP } = require("./config.js"); // Import cổng của BE_Server từ config.js

///-------Các dịch vụ API -----
// Import router API cho học phần
const { router: checkAndGetDataRouter } = require("./router/CheckAndGetData");
const {router: SetDataRouter }= require("./router/SetData");

///
const app = express();
app.use(express.json()); // Cấu hình để nhận dữ liệu JSON từ client

app.use("/api", checkAndGetDataRouter);
app.use("/api", SetDataRouter);
// --------------------Phục vụ File Tĩnh--------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'templates', 'web', 'index.html'));
});

app.use(express.static(path.join(__dirname,'..',"templates","web")));

app.use('/templates/static', express.static(path.join(__dirname, '..', 'templates', 'static')));


// --------------------Cấu hình HTTPS--------------------
let httpsServer;
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
httpsServer.listen(FE_PORT, '0.0.0.0',() => {
  console.log('FE_Server đã khởi động thành công!');
  const localIP = getLocalIP();
  localIP.forEach(ip => {
    console.log(`     - https://${ip}:${FE_PORT}`);
  });
});

// --------------------Xử lý lỗi--------------------
httpsServer.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Cổng FE_Server ${FE_PORT} đã được sử dụng. Vui lòng chọn cổng khác.`);
  }
  else {
    console.error("Lỗi khi khởi tạo FE_Server:", err);
  }
});
