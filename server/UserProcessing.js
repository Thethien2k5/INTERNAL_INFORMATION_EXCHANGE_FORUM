const { CheckUserIDFromDatabase } = require("./router/CheckAndGetData");
const {
  AddNewUsersByCallingDatabase,
  AddUsersToTheGroupInTheDatabase,
} = require("./router/SetData");
const bcrypt = require("bcrypt");

// Xử lý thông tin người mới đăng ký
async function ProcessingInformationWhenAddingUsers(username, email, password) {
  //Tao ID chỉ có số tự nhiên N độ dài 12
  let attempts = 0;
  var userId = "";
  do {
    for (let i = 0; i < 9; i++) {
      userId += Math.floor(Math.random() * 10); // từng chữ số từ 0-9
    }
    attempts++;
    if (attempts > 100) {
      throw new Error("Không thể tạo ID hợp lệ sau 100 lần thử.");
    }
  } while (await CheckUserIDFromDatabase(userId));

  //Mã hóa pass
  const hashedPassword = await bcrypt.hash(password, 10);
  //Thêm người dùng mới
  try {
    const result = await AddNewUsersByCallingDatabase(
      userId,
      username,
      username,
      email,
      hashedPassword
    );
    if (result) {
      //Thêm người dùng vào nhóm chung
      let groupId = "11"; /// ID nhóm chung
      AddUsersToTheGroupInTheDatabase(groupId, userId);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Lỗi khi thêm người dùng:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm này
  }
}

module.exports = { ProcessingInformationWhenAddingUsers };
