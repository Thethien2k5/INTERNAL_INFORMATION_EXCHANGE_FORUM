const { AddUser } = require("../../mysql/dbUser");
const { joinForum } = require("../../mysql/db.Forums");
const { getID } = require("../../mysql/db.Courses");
const { CheckIsUserInForum } = require("./CheckAndGetData");

const express = require("express");
const router = express.Router();
// const { route } = require("./RegisterAndSendEmail");

//===== Các hàm có nhiệm vụ GỌI chỉnh sửa thông tin trên db =====
//api thêm user vào nhóm chat khi đăng ký học phần
router.post("/AddAccordingToCode", async (req, res) => {
  const { userID, courseID } = req.body;
  try {
    const ForumId = await getID(courseID); // Lấy ID nhóm chát
    //Kiểm tra đã đăng ký chưa
    if (await CheckIsUserInForum(ForumId, userID)) {
      return res.json({
        success: false
      });
    }
    const result = await joinForum(ForumId, userID);
    res.json({ success: result });
  } catch (err) {
    res.status(500).json({ success: false, message: "Đăng ký thất bại" });
  }
});

///Thêm user mới
async function AddNewUsersByCallingDatabase(
  id,
  Name,
  username,
  email,
  password_hash
) {
  // Thêm người dùng mới vào cơ sở dữ liệu
  try {
    const result = await AddUser(id, Name, username, email, password_hash);
    return result; // Trả về true nếu thêm thành công, false nếu không
  } catch (error) {
    console.error("Lỗi khi thêm user:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm này
  }
}

///Thêm người dùng vào nhóm cụ thể
async function AddUsersToTheGroupInTheDatabase(ForumId, UserId) {
  try {
    const result = await joinForum(ForumId, UserId);
    return result;
  } catch (error) {
    console.error("Lỗi khi thêm user vào nhóm:", error);
    throw error;
  }
}

module.exports = {
  router,
  AddNewUsersByCallingDatabase,
  AddUsersToTheGroupInTheDatabase,
};
