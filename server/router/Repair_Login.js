const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { GetPassword_hash } = require("../../mysql/dbUser");

// Xử lý POST /api/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Thiếu thông tin!" });
  }
  try {
    const hash = await GetPassword_hash(username);
    if (!hash) {
      return res.status(401).json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu!" });
    }
    const match = await bcrypt.compare(password, hash);
    if (match) {
      res.json({ success: true, message: "Đăng nhập thành công!" });
    } else {
      res.status(401).json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu!" });
    }
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
});

module.exports = router;
