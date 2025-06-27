// a/internal_information_exchange_forum/INTERNAL_INFORMATION_EXCHANGE_FORUM-2182a44dd49a4e4e5f03831f79663ed01dfd8885/mysql/db.Forums.js

const { pool } = require("./dbUser"); // Import kết nối CSDL

// Hàm tạo nhóm chat mới
async function createForum(name, topic, creatorId) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction(); // Bắt đầu transaction để đảm bảo toàn vẹn dữ liệu

    // SỬA LỖI: Đổi `creator_id` thành `created_by_user_id` cho đúng với CSDL
    const createForumSql = `INSERT INTO if_forums (ForumName, topic, created_by_user_id) VALUES (?, ?, ?)`;
    const [result] = await connection.execute(createForumSql, [
      name,
      topic,
      creatorId,
    ]);
    const newForumId = result.insertId;

    // Tự động thêm người tạo vào làm thành viên của nhóm
    const addMemberSql = `INSERT INTO if_forum_members (forum_id, user_id) VALUES (?, ?)`;
    await connection.execute(addMemberSql, [newForumId, creatorId]);

    await connection.commit(); // Hoàn tất transaction nếu mọi thứ thành công

    // Trả về thông tin nhóm vừa tạo (đã sửa lại cho nhất quán với tên cột)
    return { id: newForumId, name, topic, created_by_user_id: creatorId };
  } catch (error) {
    await connection.rollback(); // Hoàn tác mọi thay đổi nếu có lỗi
    console.error("Lỗi khi tạo forum:", error);
    throw error; // Ném lỗi để tầng trên xử lý
  } finally {
    connection.release(); // Trả kết nối về pool
  }
}

// Thêm một người dùng vào một nhóm chat đã tồn tại
async function joinForum(forumId, userId) {
  const sql = `INSERT INTO if_forum_members (forum_id, user_id) VALUES (?, ?)`;
  const [result] = await pool.execute(sql, [forumId, userId]);
  return result.affectedRows > 0;
}
//kiểm tra người dùng đã có ở trong nhóm này chưa
async function IsUserInForum(ForumID, UserID) {
  const [rows] = await pool.execute(
    "SELECT 1 FROM if_forum_members WHERE forum_id = ? AND user_id = ? LIMIT 1",
    [ForumID, UserID]
  );

  return rows.length > 0;
}

// Lấy tất cả các nhóm chat mà một người dùng đang tham gia.
async function getForumsForUser(userId) {
  const sql = `
    SELECT f.id, f.CourseID, f.CourseName AS name , f.topic, f.created_at
    FROM if_forums f
    JOIN if_forum_members fm ON f.id = fm.forum_id
    WHERE fm.user_id = ?
  `;
  const [forums] = await pool.execute(sql, [userId]);
  return forums;
}

// Lấy danh sách tất cả thành viên trong một nhóm chat cụ thể
async function getForumMembers(forumId) {
  const sql = `
        SELECT u.id, u.Name, u.avatar
        FROM if_users u
        JOIN if_forum_members fm ON u.id = fm.user_id
        WHERE fm.forum_id = ?;
    `;
  const [members] = await pool.execute(sql, [forumId]);
  return members;
}

// Lấy thông tin chi tiết của một nhóm chat bằng ID của nó
async function getForumById(forumId) {
  const sql = `SELECT * FROM if_forums WHERE id = ?`;
  const [rows] = await pool.execute(sql, [forumId]);
  return rows.length > 0 ? rows[0] : null;
}

// Rời khỏi một nhóm chat.
// async function removeMemberFromForum(forumId, userId) {
//   const sql = `DELETE FROM if_forum_members WHERE forum_id = ? AND user_id = ?`;
//   const [result] = await pool.execute(sql, [forumId, userId]);
//   return result.affectedRows > 0;
// }

module.exports = {
  createForum,
  joinForum,
  getForumsForUser,
  getForumMembers,
  getForumById,
<<<<<<< HEAD
  removeMemberFromForum,
  IsUserInForum,
=======
>>>>>>> ThongvaAI
};
