const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { GetPassword_hash, GetAvatar } = require("../mysql/dbUser");

// Xử lý POST /api/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu thông tin!" });
  }
  try {
    //mã hóa mật khẩu
    const hash = await GetPassword_hash(username);
    if (!hash) {
      return res
        .status(401)
        .json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu!" });
    }
    const match = await bcrypt.compare(password, hash);
    if (match) {
      let avatar = await GetAvatar(username);
      if (!avatar || avatar.trim() === "") {
        // Nếu không có thì dùng ảnh mặc định
        avatar = "templates/static/images/logoT3V.png";
      }
      res.json({
        success: true,
        message: "Đăng nhập thành công!",
        user: {
          username,
          avatar: `uploads/AvatarsUser/${avatar}`,
        },
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu!" });
    }
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
});

module.exports = router;
