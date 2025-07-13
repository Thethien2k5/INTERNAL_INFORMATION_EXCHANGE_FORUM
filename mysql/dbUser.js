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
  );`x`
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
//Thêm user mới
async function AddUser(id, Name, username, email, password_hash) {
  const [result] = await pool.execute(
    "INSERT INTO if_users (id, Name, username, email, password_hash) VALUES (?, ?, ?, ?, ?)",
    [id, Name, username, email, password_hash]
  );
  return result.affectedRows > 0; // Trả về true nếu thêm thành công
}
//Chỉnh sửa thông tin user
async function SetInforUser(id, name, gender, avatar) {
  const fields = [];
  const values = [];

  if (name !== undefined) {
    fields.push("Name = ?");
    values.push(name);
  }

  if (gender !== undefined) {
    fields.push("gender = ?");
    values.push(gender);
  }

  if (avatar !== undefined) {
    fields.push("avatar = ?");
    values.push(avatar);
  }

  if (fields.length === 0) return false;

  values.push(id); // Cho điều kiện WHERE

  const sql = `UPDATE if_users SET ${fields.join(", ")} WHERE id = ?`;

  const [result] = await pool.execute(sql, values);
  return result.affectedRows > 0;
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
  const [rows] = await pool.query(
    "SELECT avatar FROM if_users WHERE username = ?",
    [username]
  );
  return rows.length > 0 ? rows[0].avatar : null;
}
// Lấy thông tin người dùng theo tên đăng nhập 
// thật ra tham số truyền vào chính là IDuser :))) mà đặt tên vậy cho hack não
async function getUserByUsername(username) {
  const [rows] = await pool.execute(
    "SELECT id, Name, gender, email, avatar, public_key, private_key, salt FROM if_users WHERE username = ? LIMIT 1",
    [username]
  );
  return rows.length > 0 ? rows[0] : null;
}
// Lấy thông tin người dùng theo ID
async function getUserById(userId) {
  try {
    const [rows] = await pool.query(
      'SELECT id, Name, gender, username, email, avatar, publc_key FROM if_users WHERE id = ?',
      [userId]
    );
    return rows[0];
  } catch (error) {
    console.error('Lỗi khi lấy thông tin user theo ID:', error);
    throw error;
  }
}
// ============= Các hàm lấy khóa công khai ====================
// Hàm cập nhật public key cho user
async function setPublicKey (userId, publicKey){
  const sql = 'UPDATA if_users SET public_key = ? WHERE id = ?';
  const [rows] = await pool.execute(sql, [publicKey, userId]);
  return rows.affectedRows > 0; // Trả về true nếu cập nhật thành công
}
// Hàm lấy public key của user
async function getPublicKey(userId) {
  const [rows] = await pool.query(
        'SELECT public_key FROM if_users WHERE id = ?',
        [userId]
  );
return rows.length > 0 ? rows[0].public_key : null;
}

//================= Lấy Pre-Key Bundle=========================
async function getSignalKeyBundle(userId) {
  const [rows] = await pool.execute(
    'SELECT id, identity_key_public, registration_id, signed_pre_key_public, signed_pre_key_signature, pre_keys FROM if_users WHERE id = ? LIMIT 1',
    [userId]
  );

  if (rows.length === 0) return null ;

  const user = rows[0];
  // Nếu user.pre_keys nếu tồn tại thì chuyển sang chuỗi văn bản thành mảng hoặc mảng rỗng 
  const preKeys = user.pre_keys ? JSON.parse(user.pre_keys) : [];
  const onePreKey = preKeys.length > 0 ? preKeys[0] : null;

  if (!onePreKey) return null; // Không có pre-key nào khả dụng

  return {
    userId: user.id,
    identityKey: user.indentity_key_public,
    registrationId: user.registration_id,
    signPreKey:{
      publicKey: user.signed_pre_key_public,
      signature: user.signed_pre_key_signature,
    },
    preKey: onePreKey // Chỉ trả về một pre-key để dùng
  };
}

//================== Lưu các Public Keys của user======================
async function saveSignalKeys(userId, keys){
  const sql = 
    `UPDATE id_user SET identity_key_public = ?, registration_id = ?, pre_keys = ?, signed_pre_key_public = ?, signed_pre_key_signature = ?
    WHERE id=?`;

  const {identityKey, registrationId, preKey, signedPreKey}= keys;

  const [result] = await pool.execute(sql,[
    identityKey,
    registrationId,
    JSON.stringify(preKey),
    signedPreKey.publicKey,
    signedPreKey.signature,
    userId
  ]);
  return result.affectedRows > 0;
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
  SetInforUser,
  setPublicKey,
  getPublicKey,
  getSignalKeyBundle,
  saveSignalKeys
};
