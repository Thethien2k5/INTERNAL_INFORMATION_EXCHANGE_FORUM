// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Đảm bảo thư mục tồn tại
// const avatarDir = path.join(__dirname, 'public/uploads/avatars');
// if (!fs.existsSync(avatarDir)) {
//   fs.mkdirSync(avatarDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, avatarDir);
//     },
//     filename: (req, file, cb) => {
//       // Đúng key userId
//       const userId = req.user && (req.user.userId || req.user.id); // fallback nếu có
//       const ext = path.extname(file.originalname).toLowerCase();
//       const timestamp = Date.now();
//       cb(null, `user_${userId}_${timestamp}${ext}`);
//     }
//   });

// const fileFilter = (req, file, cb) => {
//   const allowed = ['.jpg', '.jpeg', '.png'];
//   const ext = path.extname(file.originalname).toLowerCase();
//   if (!allowed.includes(ext)) {
//     return cb(new Error('Chỉ chấp nhận file .jpg, .jpeg, .png'), false);
//   }
//   cb(null, true);
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 2 * 1024 * 1024 } // 2MB
// });

// module.exports = upload;

// // === 1. Cấu hình multer thống nhất (avatar-config.js) ===
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Quyết định dùng đường dẫn nào - chọn 1 trong 2:
// // OPTION 1: Dùng public/uploads/avatars (recommend)
// // const avatarDir = path.join(__dirname, "../public/uploads/avatars");

// // OPTION 2: Dùng uploads/AvatarsUser (như code cũ)
// const avatarDir = path.join(__dirname, '/uploads/AvatarsUser');

// // Đảm bảo thư mục tồn tại
// if (!fs.existsSync(avatarDir)) {
//   fs.mkdirSync(avatarDir, { recursive: true });
//   console.log("Created avatar directory:", avatarDir);
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, avatarDir);
//   },
//   filename: (req, file, cb) => {
//     const userId = req.user && (req.user.userId || req.user.id);
//     const ext = path.extname(file.originalname).toLowerCase();
//     const timestamp = Date.now();
//     const filename = `user_${userId}_${timestamp}${ext}`;
//     console.log("Generated avatar filename:", filename);
//     cb(null, filename);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowed = [".jpg", ".jpeg", ".png", ".gif"];
//   const ext = path.extname(file.originalname).toLowerCase();
//   if (!allowed.includes(ext)) {
//     return cb(new Error("Chỉ chấp nhận file .jpg, .jpeg, .png, .gif"), false);
//   }
//   cb(null, true);
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
// });

// module.exports = upload;
