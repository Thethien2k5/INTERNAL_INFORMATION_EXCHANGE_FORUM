const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Import các hàm từ cơ sở dữ liệu
const { GetPassword_hash, GetAvatar, getUserByUsername } = require("../../mysql/dbUser");
const { storeRefreshToken } = require('../../mysql/db.Token');
const { jwtSecret } = require('../config');

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
      // Lấy hình ảnh 
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
        .status(401)``
        .json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu!" });
    }

    // Tạo token JWT ngắn hạn
  const use = await getUserByUsername(username);
  if (!use) {
    return res.status(404).json({ success: false, message: "Người dùng không hợp lệ.!" });
  }
  // 2. Tạo Access Token (ngắn hạn, dùng để truy cập API)
  const accessTokenPayload = { userId: user.id, username: user.username };
  const accessToken = jwt.sign(accessTokenPayload, jwtSecret, { expiresIn: '15m' }); // Hạn 15 phút

  // 3. Tạo Refresh Token (dài hạn, dùng để lấy Access Token mới)
  const refreshToken = crypto.randomBytes(64).toString('hex');
  const refreshTokenExpiry = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // Hạn 1 ngày

  // 4. Lưu Refresh Token vào CSDL
  await storeRefreshToken(user.id, refreshToken, refreshTokenExpiry);

  // 5. Gửi Refresh Token về client qua HttpOnly Cookie để bảo mật
  res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Ngăn JavaScript phía client truy cập
      secure: true,   // Chỉ gửi cookie qua kết nối HTTPS
      sameSite: 'strict', // Chống tấn công CSRF
      expires: refreshTokenExpiry, // Thời gian hết hạn của cookie
  });

  // 6. Gửi Access Token và thông tin user cơ bản về client qua JSON
  res.json({
      success: true,
      message: "Đăng nhập thành công!",
      accessToken: accessToken,
      user: {
          id: user.id,
          username: user.username,
          avatar: user.avatar
      }
  });


  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
});

module.exports = router;