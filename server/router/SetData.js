const { AddUser } = require("../../mysql/dbUser");
const { joinForum } = require("../../mysql/db.Forums");

//===== Các hàm có nhiệm vụ GỌI chỉnh sửa thông tin trên db =====

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

///Thêm người dùng vào nhóm
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
  AddNewUsersByCallingDatabase,
  AddUsersToTheGroupInTheDatabase,
};
