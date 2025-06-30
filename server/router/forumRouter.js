const express = require('express');
const router = express.Router();
const {getForumsForUser, getForumMembers,createForum } = require('../../mysql/db.Forums');
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
/*router.get('/:forumId/members', async (req, res) => {
    const { forumId } = req.params;
    try {
        const members = await getForumMembers(forumId);
        res.status(200).json({ success: true, data: members });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách thành viên ở file forumRouter:', error);
        res.status(500).json({ success: false, message: 'Lỗi lấy danh sách thành viên của forum ở file forumRouter' });
    }
});*/

// Lấy danh sách tin nhắn của một forum cụ thể
router.get('/:forumId/messages', async (req, res) => {
    const {forumId} = req.params;
    if (!forumId) {
        return res.status(400).json({ success: false, message: 'Thiếu forumId ở file forumRouter' });
    }
    try {
        const messages = await getMessagesForForum(forumId);
        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách tin nhắn diễn đàn ở file forumRouter:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách tin nhắn diễn đàn ở file forumRouter' });
    }
});

// Tạo moojt nhóm mới
router.post('/', async (req, res) => {
    const { name, topic } = req.body;
    const creatorId = req.user.userId; // Lấy từ token đã xác thực

    if (!name) {
        return res.status(400).json({ success: false, message: 'Tên nhóm là bắt buộc.' });
    }

    try {
        const newForum = await createForum(name, topic, creatorId);
        res.status(201).json({ success: true, message: 'Tạo nhóm thành công!', data: newForum });
    } catch (error) {
        console.error('Lỗi khi tạo forum:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi tạo nhóm.' });
    }
});

//Thêm thành viên vào forum
router.post('/:forumId/members', async (req, res) => {
    const { forumId } = req.params;
    const { userIdToAdd } = req.body; // ID của người dùng cần thêm

    if (!userIdToAdd) {
        return res.status(400).json({ success: false, message: 'Cần cung cấp ID người dùng để thêm.' });
    }

    try {
        // (Nâng cao): Kiểm tra xem người yêu cầu có phải admin của nhóm không
        // Hiện tại, chúng ta cho phép thêm tự do
        const success = await joinForum(forumId, userIdToAdd);
        if (success) {
            res.status(200).json({ success: true, message: 'Thêm thành viên thành công.' });
        } else {
            res.status(400).json({ success: false, message: 'Không thể thêm thành viên, có thể họ đã ở trong nhóm.' });
        }
    } catch (error) {
        console.error('Lỗi khi thêm thành viên:', error);
        // Bắt lỗi duplicate entry
        if (error.code === 'ER_DUP_ENTRY') {
             return res.status(409).json({ success: false, message: 'Người dùng này đã là thành viên của nhóm.' });
        }
        res.status(500).json({ success: false, message: 'Lỗi server khi thêm thành viên.' });
    }
});

module.exports = router;