
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
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Lỗi khi lưu tin nhắn vào DB:', error);
        return false;
    }
}

module.exports = { saveMessage };