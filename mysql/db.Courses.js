// mysql/db.Courses.js
const { pool } = require("./dbUser"); // kết nối CSDL

///Trong bảng danh danh sách học phần có cả nhóm tự tạo và nhóm học phần
///Phân biệt Nhóm chat bình thw và nhóm học bằng số lượng số trong mã

//Lấy danh sách học phần
const getAllCourses = async () => {
  // Sửa lại lệnh SQL để chỉ lấy các CourseID có nhiều hơn 7 chữ số.
  // Giả định CourseID là một kiểu số (INT) hoặc VARCHAR chỉ chứa số.
  const [rows] = await pool.query(
    "SELECT CourseID, CourseName, Credits, TuitionFee FROM if_courses WHERE LENGTH(CourseID) > 7"
  );
  return rows;
};
///Tìm id forms theo mã học phần
async function getID(CourseID) {
  const [rows] = await pool.execute(
    "SELECT id FROM if_forums WHERE CourseID = ? LIMIT 1",
    [CourseID]
  );

  if (rows.length > 0) {
    return rows[0].id;
  } else {
    throw new Error("Không tìm thấy forum tương ứng với CourseID " + CourseID);
  }
}


module.exports = { getAllCourses, getID };
