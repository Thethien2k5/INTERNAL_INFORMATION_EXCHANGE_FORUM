// Nạp import thư viện mysql2/promise để sử dụng kết nối Promise-based
// Thư viện này cho phép sử dụng async/await để xử lý kết nối cơ sở dữ liệu một cách dễ dàng hơn
const mysql = require("mysql2/promise");

// Tạo pool kết nối dùng chung
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  // password: 'your_password',
  database: "internal_information_exchange_forum",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
//====== Các hàm có nhiệm vụ kiểm tra thông tin user========
// Hàm kiểm tra email đã tồn tại trong DB chưa
async function CheckEmail(email) {
  const [rows] = await pool.execute(
    "SELECT 1 FROM if_users WHERE email = ? LIMIT 1",
    [email]
  );
  return rows.length > 0;
}
//kiểm tra tên người dùng
async function CheckUserName(email) {
  const [rows] = await pool.execute(
    "SELECT 1 FROM if_users WHERE username = ? LIMIT 1",
    [email]
  );
  return rows.length > 0;
}
//Kiểm tra ID tồn tại
async function CheckUserId(userId) {
  const [rows] = await pool.execute(
    "SELECT 1 FROM if_users WHERE id = ? LIMIT 1",
    [userId]
  );
  return rows.length > 0; // Trả về true nếu ID tồn tại
}
//====Các hàm có nhiệm vụ chỉnh sửa thông tin user======
//Thêm user
async function AddUser(id, Name, username, email, password_hash) {
  const [result] = await pool.execute(
    "INSERT INTO if_users (id, Name, username, email, password_hash) VALUES (?, ?, ?, ?, ?)",
    [ id, Name, username, email, password_hash]
  );
  return result.affectedRows > 0; // Trả về true nếu thêm thành công
}
//====== Các hàm có nhiệm lấy dự liệu user từ database========
//Get name
async function GetPassword_hash(username) {
  const [rows] = await pool.execute(
    "SELECT password_hash FROM if_users WHERE username = ? LIMIT 1",
    [username]
  );
  return rows.length > 0 ? rows[0].password_hash : null; // Trả về password hash nếu tìm thấy
}
async function GetAvatar(username) {
  // ví dụ dùng MySQL:
  const [rows] = await pool.query(
    "SELECT avatar FROM if_users WHERE username = ?",
    [username]
  );
  return rows.length > 0 ? rows[0].avatar : null;
}
// Lấy thông tin người dùng theo tên đăng nhập
async function getUserByUsername(username) {
  const [rows] = await pool.execute(
    "SELECT id, Name, email, avatar FROM if_users WHERE username = ? LIMIT 1",
    [username]
  );
  return rows.length > 0 ? rows[0] : null;
}
// Lấy thông tin người dùng theo ID
async function getUserById(userId) {
  const [rows] = await pool.execute(
    "SELECT id, username, email, avatar FROM if_users WHERE id = ? LIMIT 1",
    [userId]
  );
  return rows.length > 0 ? rows[0] : null;
}

//xuất (export) các biến/hàm ra ngoài file
module.exports = {
  pool,
  CheckEmail,
  CheckUserName,
  AddUser,
  GetPassword_hash,
  GetAvatar,
  getUserByUsername,
  getUserById,
  CheckUserId,
};
