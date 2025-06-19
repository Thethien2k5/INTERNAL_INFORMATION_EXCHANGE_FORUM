// const { model } = require('mongoose');
const { pool } = require('./dbUser');

// Hàm lưu refresh token vào cơ sở dữ liệu
async function storeRefreshToken(userId, token, expiresAt) {
  const sql = 'INSERT INTO if_refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)';
  const [result] = await pool.execute(sql, [userId, token, expiresAt]);
  return result.affectedRows > 0;
}

// Hàm timf refresh token khỏi cơ sở dữ liệu
async function findRefreshToken(token) {
    const sql = 'SELECT * FROM if_refresh_tokens WHERE token = ? AND expires_at > NOW()';
    const [rows] = await pool.execute(sql, [token]);
    return rows.length > 0 ? rows[0] : null;
}

module.exports = {
    storeRefreshToken,
    findRefreshToken
};