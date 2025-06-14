// a/internal_information_exchange_forum/INTERNAL_INFORMATION_EXCHANGE_FORUM-2182a44dd49a4e4e5f03831f79663ed01dfd8885/mysql/db.Forums.js

const pool = require('../config/db'); // Import kết nối CSDL


// Hàm tạo nhóm chat mới
async function createForum(name, topic, creatorId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction(); // Bắt đầu transaction để đảm bảo toàn vẹn dữ liệu

        // Tạo nhóm chat mới trong bảng `if_forums`
        const createForumSql = `INSERT INTO if_forums (name, topic, creator_id) VALUES (?, ?, ?)`;
        const [result] = await connection.execute(createForumSql, [name, topic, creatorId]);
        const newForumId = result.insertId;

        // Tự động thêm người tạo vào làm thành viên của nhóm
        const addMemberSql = `INSERT INTO if_forum_members (forum_id, user_id) VALUES (?, ?)`;
        await connection.execute(addMemberSql, [newForumId, creatorId]);

        await connection.commit(); // Hoàn tất transaction nếu mọi thứ thành công
        
        // Trả về thông tin nhóm vừa tạo
        return { id: newForumId, name, topic, creator_id: creatorId };
    } catch (error) {
        await connection.rollback(); // Hoàn tác mọi thay đổi nếu có lỗi
        console.error('Lỗi khi tạo forum:', error);
        throw error; // Ném lỗi để tầng trên xử lý
    } finally {
        connection.release(); // Trả kết nối về pool
    }
}

// Thêm một người dùng vào một nhóm chat đã tồn tại.

async function joinForum(forumId, userId) {
    const sql = `INSERT INTO if_forum_members (forum_id, user_id) VALUES (?, ?)`;
    const [result] = await pool.execute(sql, [forumId, userId]);
    return result.affectedRows > 0;
}

// Lấy tất cả các nhóm chat mà một người dùng đang tham gia.

async function getForumsForUser(userId) {
    const sql = `
        SELECT f.id, f.name, f.topic, f.created_at
        FROM if_forums f
        JOIN if_forum_members fm ON f.id = fm.forum_id
        WHERE fm.user_id = ? AND f.deleted_at IS NULL;
    `;
    const [forums] = await pool.execute(sql, [userId]);
    return forums;
}

// Lấy danh sách tất cả thành viên trong một nhóm chat cụ thể
async function getForumMembers(forumId) {
    const sql = `
        SELECT u.id, u.username, u.avatar
        FROM if_users u
        JOIN if_forum_members fm ON u.id = fm.user_id
        WHERE fm.forum_id = ?;
    `;
    const [members] = await pool.execute(sql, [forumId]);
    return members;
}

// Lấy thông tin chi tiết của một nhóm chat bằng ID của nó
async function getForumById(forumId) {
    const sql = `SELECT * FROM if_forums WHERE id = ? AND deleted_at IS NULL`;
    const [rows] = await pool.execute(sql, [forumId]);
    return rows.length > 0 ? rows[0] : null;
}

// Rời khỏi một nhóm chat.
async function removeMemberFromForum(forumId, userId) {
    const sql = `DELETE FROM if_forum_members WHERE forum_id = ? AND user_id = ?`;
    const [result] = await pool.execute(sql, [forumId, userId]);
    return result.affectedRows > 0;
}


module.exports = {
    createForum,
    joinForum,
    getForumsForUser,
    getForumMembers,
    getForumById,
    removeMemberFromForum,
};