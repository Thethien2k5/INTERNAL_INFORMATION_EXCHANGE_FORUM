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
// Gợi ý sửa file: server/router/Repair_Login.js
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Thiếu thông tin!" });
    }

    try {
        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu!" });
        }

        const hash = await GetPassword_hash(username);
        if (!hash) {
            // Trường hợp này hiếm khi xảy ra nếu user tồn tại, nhưng vẫn nên kiểm tra
            return res.status(500).json({ success: false, message: "Không tìm thấy thông tin xác thực." });
        }
        
        const match = await bcrypt.compare(password, hash);

        if (match) {
            // Mật khẩu chính xác, bắt đầu tạo và gửi tokens

            // 1. Tạo Access Token (ngắn hạn)
            const accessTokenPayload = { userId: user.id, username: user.username };
            const accessToken = jwt.sign(accessTokenPayload, jwtSecret, { expiresIn: '15m' });

            // 2. Tạo Refresh Token (dài hạn)
            const refreshToken = crypto.randomBytes(64).toString('hex');
            const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Hạn 7 ngày

            // 3. Lưu Refresh Token vào CSDL
            await storeRefreshToken(user.id, refreshToken, refreshTokenExpiry);

            // 4. Gửi Refresh Token về client qua HttpOnly Cookie để bảo mật
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,   // Chỉ gửi cookie qua HTTPS
                sameSite: 'strict',
                expires: refreshTokenExpiry,
            });

            // 5. Gửi Access Token và thông tin user cơ bản về client qua JSON (đây là phản hồi cuối cùng)
            res.json({
                success: true,
                message: "Đăng nhập thành công!",
                accessToken: accessToken,
                user: {
                    id: user.id,
                    username: user.username,
                    avatar: user.avatar ? `uploads/AvatarsUser/${user.avatar}` : "templates/static/images/logoT3V.png"
                }
            });

        } else {
            // Mật khẩu không khớp
            res.status(401).json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu!" });
        }
    } catch (err) {
        // Xử lý các lỗi khác, ví dụ như lỗi kết nối CSDL (nếu lại xảy ra)
        console.error("Lỗi đăng nhập:", err);
        res.status(500).json({ success: false, message: "Lỗi server!" });
    }
});

module.exports = router;