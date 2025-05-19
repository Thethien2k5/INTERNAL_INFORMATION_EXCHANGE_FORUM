const mongoose = require("mongoose");
const User = require("./utils/hash");

// Kết nối tới MongoDB (sử dụng database 'forum' như trong .env)
mongoose
  .connect("mongodb://localhost:27017/forum")
  .then(async () => {
    // Tạo đối tượng user mới với thông tin đầu vào
    // // Xóa user cũ nếu đã tồn tại
    // await User.deleteOne({ username: "testuser" });
    const user = new User({
      username: "testuser",
      password: "123456",
      email: "testuser@example.com",
      role: "user",
    });

    // Lưu user vào database (sẽ tự động mã hóa mật khẩu nhờ middleware)
    await user.save();

    // In ra user sau khi đã lưu (mật khẩu đã được mã hóa)
    console.log("User đã lưu:", user);
    // Xóa toàn bộ user sau khi chạy xong
    await User.deleteMany({});

    // Đóng kết nối
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Lỗi:", err);
    mongoose.connection.close();
  });
