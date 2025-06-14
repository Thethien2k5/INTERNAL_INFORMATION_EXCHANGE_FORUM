
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


async function getMessagesForForum(forumId) {
    try {
        const sql = `
            SELECT
                m.id,
                m.forum_id,
                m.user_id,
                u.username,
                u.avatar,
                m.content_type,
                m.content_text,
                m.file_name,
                m.file_path,
                m.file_size,
                m.file_mime_type,
                m.created_at
            FROM if_messages m
            JOIN if_users u ON m.user_id = u.id
            WHERE m.forum_id = ?
            ORDER BY m.created_at ASC; 
        `;
        const [messages] = await pool.execute(sql, [forumId]);
        return messages;
    } catch (error) {
        console.error('Lỗi khi lấy tin nhắn cho forum:', error);
        throw error; // Ném lỗi để tầng trên xử lý
    }
}

module.exports = { 
    saveMessage,
    getMessagesForForum 
};