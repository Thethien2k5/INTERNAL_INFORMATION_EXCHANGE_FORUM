
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');
const { findRefreshToken } = require('../../mysql/db.Token');
const { getUserById } = require('../../mysql/dbUser');

router.post('/refresh-token', async (req, res) => {
    // Lấy refresh token từ cookie mà client tự động gửi lên
    const tokenFromCookie = req.cookies.refreshToken;

    if (!tokenFromCookie) {
        // Nếu không có refresh token, từ chối truy cập
        return res.status(401).json({ success: false, message: 'Không tìm thấy Refresh Token.' });
    }

    try {
        // Tìm token này trong CSDL xem có hợp lệ không
        const storedToken = await findRefreshToken(tokenFromCookie);

        if (!storedToken) {
            // Nếu token không tồn tại hoặc đã hết hạn trong CSDL
            return res.status(403).json({ success: false, message: 'Refresh Token không hợp lệ.' });
        }

        // Lấy thông tin người dùng từ user_id trong token
        const user = await getUserById(storedToken.user_id);
        if (!user) {
            return res.status(403).json({ success: false, message: 'Người dùng không tồn tại.' });
        }

        // Nếu mọi thứ hợp lệ, tạo một Access Token MỚI
        const accessTokenPayload = { userId: user.id, username: user.username };
        const newAccessToken = jwt.sign(accessTokenPayload, jwtSecret, { expiresIn: '15m' });

        // Gửi Access Token mới về cho client
        res.json({
            success: true,
            accessToken: newAccessToken
        });

    } catch (error) {
        console.error("Lỗi khi làm mới token:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ." });
    }
});

module.exports = router;