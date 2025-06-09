
const { pool } = require('./dbUser'); // Dùng lại pool kết nối đã có

async function saveMessage(messageData) {
    const { forumId, userId, contentType, contentText = null, fileInfo = {} } = messageData;
    const { fileName = null, filePath = null, fileSize = null, fileMimeType = null } = fileInfo;

    try {
        const sql = `
            INSERT INTO if_messages 
            (forum_id, user_id, content_type, content_text, file_name, file_path, file_size, file_mime_type) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.execute(sql, [
            forumId,
            userId,
            contentType,
            contentText,
            fileName,
            filePath,
            fileSize,
            fileMimeType
            // Không cần thêm created_at, nó sẽ tự động được quản lý bởi MySQL nếu đã cấu hình đúng
        ]);
        if (result.affectedRows > 0) {
            // Lấy lại tin nhắn vừa tạo để trả về
            const [rows] = await pool.execute('SELECT * FROM if_messages WHERE id = ?', [result.insertId]);
            return { success: true, data: rows[0] };
        }
        return { success: false };
    } catch (error) {
        console.error('Lỗi khi lưu tin nhắn vào DB:', error);
        return false;
    }
}

module.exports = { saveMessage };