const express = require("express");
const router = express.Router();
const { CheckLogin } = require("../mysql/dbUser"); // Hàm kiểm tra trong db

// Xử lý POST /api/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await CheckLogin(username, password); // nên trả về thông tin nếu đúng
    if (!user) {
      return res.status(401).json({ success: false, message: "Thông tin đăng nhập không chính xác" });
    }

    return res.json({
      success: true,
      message: "Đăng nhập thành công",
      user,
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
});

module.exports = router;
