const mysql = require('mysql2/promise');

// Tạo pool kết nối dùng chung
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    // password: 'your_password',
    database: 'internal_information_exchange_forum',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Hàm kiểm tra email đã tồn tại trong DB chưa
async function CheckEmail(email) {
    const [rows] = await pool.execute(
        'SELECT 1 FROM if_users WHERE email = ? LIMIT 1',
        [email]
    );
    return rows.length > 0;
}
async function CheckUserName(email) {
    const [rows] = await pool.execute(
        'SELECT 1 FROM if_users WHERE username = ? LIMIT 1',
        [email]
    );
    return rows.length > 0;
}
//xuất (export) các biến/hàm ra ngoài file
module.exports = {
    pool,
    CheckEmail,
    CheckUserName
};