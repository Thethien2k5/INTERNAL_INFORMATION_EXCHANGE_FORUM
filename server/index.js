const express = require("express");
const app = express();
const RegisRoutes = require("./RegisterAndSendEmail");
const loginRoutes = require("./Repair_Login");


app.use(express.json());
app.use("/api", RegisRoutes);
app.use("/api", loginRoutes);


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
