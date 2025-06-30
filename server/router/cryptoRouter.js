const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken'); // Middleware để xác thực token
const { setPublicKey, getPublicKey, getUserById } = require('../../mysql/dbUser');
const { getForumMembers } = require('../../mysql/db.Forums');
//  Cập nhật public key cho user
router.post('/setpublickey', verifyToken, async (req, res) => {
    const userId = req.user.userId; // Lấy userId từ token đã được giải mã
    const { publicKey } = req.body;
    if (!publicKey) {
        return res.status(400).json({ success: false, message: 'Thiếu public key (crytoRouter.js)' });
    }
    try {
       await setPublicKey(userId, publicKey);
        res.status(200).json({ success: true, message: 'Public key đã được cập nhật thành công.' });
    }
    catch (error) {
        console.error('Lỗi khi cập nhật public key:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật public key.' });
    }
});

// Lấy public key của user theo userId
router.get('/getpublickey/:userId', verifyToken, async (req, res) => {
    const {userId} = req.params; // Lấy userId từ tham số URL
    try {
        const publicKey = await getPublicKey(userId);
        if (!publicKey) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy public key cho user này.' });
        }
        else {
            res.status(200).json({ success: true, publicKey: publicKey });
        }
    } catch (error) {
        console.error('Lỗi khi lấy public key:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy public key.' });
    }
});

router.get('/forums/:forumId/members/details', verifyToken, async (req, res) => {
    const { forumId } = req.params; // Lấy forumId từ tham số URL
    try {
        const members = await getForumMembers(forumId);
        const memberDetails = await Promise.all(members.map(async (member) => {
            const userDetails = await getUserById(member.id);
            return {
                id: userDetails.id,
                name: userDetails.Name,
                avatar: userDetails.avatar,
                publicKey: userDetails.public_key // Lấy public key từ thông tin người dùng
            };
        }));
        res.status(200).json({ success: true, members: memberDetails });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin thành viên của forum:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy thông tin thành viên của forum.' });
    }   
});

module.exports = router;


