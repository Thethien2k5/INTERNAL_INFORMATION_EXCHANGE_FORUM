
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

function verifyToken(req, res, next) {
    // Lấy header 'Authorization' từ request
    const authHeader = req.headers['authorization'];
    // Header có định dạng "Bearer <token>". Chúng ta cần lấy phần token.
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // Nếu không có token, trả về lỗi 401 (Unauthorized)
        return res.status(401).json({ success: false, message: 'Yêu cầu cần token để xác thực.' });
    }

    // Xác thực token
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            // Nếu token không hợp lệ hoặc đã hết hạn (lỗi 15 phút)
            // Trả về lỗi 403 (Forbidden) để client biết rằng cần phải refresh token
            return res.status(403).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn.' });
        }

        // Nếu token hợp lệ, lưu thông tin đã giải mã (payload) vào đối tượng request
        // để các hàm xử lý phía sau có thể sử dụng
        req.user = decoded;
        
        // Cho phép request đi tiếp đến hàm xử lý chính của route
        next();
    });
}

module.exports = verifyToken;