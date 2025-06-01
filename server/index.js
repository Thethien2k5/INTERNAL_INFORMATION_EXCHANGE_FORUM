const express = require("express");
const app = express();
const otpRoutes = require("./otp_server");
const loginRoutes = require("./Repair_Login");


app.use(express.json());
app.use("/api", otpRoutes);
app.use("/api", loginRoutes);


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
