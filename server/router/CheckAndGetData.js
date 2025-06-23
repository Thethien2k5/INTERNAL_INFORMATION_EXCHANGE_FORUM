// CheckAndGetData.js
const express = require("express");
const router = express.Router();
const dbCourses = require("../../mysql/db.Courses");
const { CheckUserId } = require("../../mysql/dbUser");

// API lấy danh sách học phần
router.get("/courses", async (req, res) => {
    try {
        const courses = await dbCourses.getAllCourses();
        res.json({ success: true, data: courses });
    } catch (err) {
        console.error("Lỗi khi lấy dữ liệu học phần:", err);
        res.status(500).json({ success: false, message: "Lỗi server khi lấy dữ liệu học phần." });
    }
    
});

// Hàm kiểm tra ID người dùng (xuất riêng)
async function CheckUserIDFromDatabase(userID) {
    try {
        return await CheckUserId(userID);
    } catch (error) {
        console.error("Lỗi khi kiểm tra user ID:", error);
        throw error;
    }
}

// 👉 Export cả router và hàm check
module.exports = {
    router,
    CheckUserIDFromDatabase
};
