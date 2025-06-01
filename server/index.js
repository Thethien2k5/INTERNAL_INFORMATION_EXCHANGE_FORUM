const express = require("express");
const app = express();
const otpRoutes = require("./otp_server");


app.use(express.json());
app.use("/api", otpRoutes);


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
