const { CheckUserId } = require("../../mysql/dbUser");
//===== Các hàm có nhiệm vụ GỌI kiểm tra thông tin trên db =====
//Kiêm tra ID người dùng từ db
async function CheckUserIDFromDatabase(userID) {
    try {
        // Kiểm tra xem userID có tồn tại trong cơ sở dữ liệu không
        const exists = await CheckUserId(userID);
        return exists; // Trả về true nếu ID tồn tại, false nếu không
    } catch (error) {
        console.error("Error checking user ID:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm này
    }
}
module.exports = { CheckUserIDFromDatabase };
