const express = require('express');
const router = express.Router();
const {getForumsForUser, getForumMembers } = require('../../mysql/db.Forums');
const {getMessagesForForum } = require('../../mysql/db.Messages');

// Middleware để xác thực token (nếu cần) import
const verifyToken = require('../middleware/verifyToken');
// Bất kỳ request nào tới /api/forums/... đều phải có token hợp lệ
// YÊU CẦU TẤT CẢ CÁC ROUTE TRONG FILE NÀY PHẢI ĐI QUA verifyToken
router.use(verifyToken);
// ======================================

// Lấy danh sách các forums mà user đã tham gia
router.get('/', async (req, res) => {
    try {
    //Lấy userId từ token đã được giải mã, không cần lấy từ query string 
        const userId = req.user.userId;

        const forums = await getForumsForUser(userId);
        res.status(200).json({ success: true, data: forums });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách diễn đàn:', error);
        res.status(500).json({ success: false, message: 'Lỗi lấy danh sách forum của user' });
    }   
});


// Lấy danh sách thành viên của một forum cụ thể
router.get('/:forumId/members', async (req, res) => {
    const { forumId } = req.params;
    try {
        const members = await getForumMembers(forumId);
        res.status(200).json({ success: true, data: members });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách thành viên:', error);
        res.status(500).json({ success: false, message: 'Lỗi lấy danh sách thành viên của forum' });
    }
});

// Lấy danh sách tin nhắn của một forum cụ thể
router.get('/:forumId/messages', async (req, res) => {
    const forumId = req.params;
    if (!forumId) {
        return res.status(400).json({ success: false, message: 'Thiếu forumId' });
    }
    try {
        const messages = await getMessagesForForum(forumId);
        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách tin nhắn diễn đàn:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách tin nhắn diễn đàn' });
    }
});

module.exports = router;