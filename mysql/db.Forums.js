const { pool } = require('./dbUser');

// Hàm này sẽ lấy thông tin diễn đàn theo ID
async function createForum(name, topic, passwordHash, createdByUserId) {
    const sql = `INSERT INTO if_forums (name, topic, password_hash, created_by_user_id) VALUES (?, ?, ?, ?)`;
    const [result] = await pool.execute(sql, [name, topic, passwordHash, createdByUserId]);
    const forumId = result.insertId;
    // Sau khi tạo, tự động thêm người tạo vào làm thành viên
    await joinForum(forumId, createdByUserId);
    return { id: forumId, name, topic, created_by_user_id: createdByUserId };
}

// Hàm này sẽ mời người dùng tham gia diễn đàn
async function joinForum(forumId, userId) {
    const sql = `INSERT INTO if_forum_members (forum_id, user_id) VALUES (?, ?)`;
    const [result] = await pool.execute(sql, [forumId, userId]);
    return result.affectedRows > 0;
}


async function getForumsForUser(userId) {
    const sql = `
        SELECT f.id, f.name, f.topic
        FROM if_forums f
        JOIN if_forum_members fm ON f.id = fm.forum_id
        WHERE fm.user_id = ? AND f.deleted_at IS NULL
    `;
    const [rows] = await pool.execute(sql, [userId]);
    return rows;
}


async function getForumMembers(forumId) {
    const sql = `
        SELECT u.id, u.username
        FROM if_users u
        JOIN if_forum_members fm ON u.id = fm.user_id
        WHERE fm.forum_id = ?
    `;
    const [rows] = await pool.execute(sql, [forumId]);
    return rows;
}



async function isUserMember(forumId, userId) {
    const sql = `SELECT 1 FROM if_forum_members WHERE forum_id = ? AND user_id = ?`;
    const [rows] = await pool.execute(sql, [forumId, userId]);
    return rows.length > 0;
}

async function removeMemberFromForum(forumId, memberId) {
    const sql = `DELETE FROM if_forum_members WHERE forum_id = ? AND user_id = ?`;
    const [result] = await pool.execute(sql, [forumId, memberId]);
    return result.affectedRows > 0;
}

async function softDeleteForum(forumId) {
    const sql = `UPDATE if_forums SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`;
    const [result] = await pool.execute(sql, [forumId]);
    return result.affectedRows > 0;
}


module.exports = {
    createForum,
    joinForum,
    getForumsForUser,
    getForumMembers,
    getForumById,      
    isUserMember,       
    removeMemberFromForum, 
    softDeleteForum 
}