const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const verifyToken = require("../middleware/verifyToken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  GetPassword_hash,
  getUserByUsername,
  getUserById,
  SetInforUser,
} = require("../../mysql/dbUser");

const { storeRefreshToken } = require("../../mysql/db.Token");
const { jwtSecret } = require("../config");

// ==== Lấy thông tin user hiện tại
router.get("/user/me", verifyToken, async (req, res) => {
  try {
    const user = await getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin người dùng.",
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        avatar: user.avatar
          ? `${user.avatar}`
          : "logoT3V.png",
      },
    });
  } catch (err) {
    console.error("Lỗi khi lấy thông tin user:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thông tin người dùng.",
    });
  }
});

// ==== Xử lý login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu thông tin!" });
  }

  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu!" });
    }

    const hash = await GetPassword_hash(username);
    if (!hash) {
      return res.status(500).json({
        success: false,
        message: "Không tìm thấy thông tin xác thực.",
      });
    }

    const match = await bcrypt.compare(password, hash);

    if (match) {
      const accessTokenPayload = { userId: user.id, username: user.username };
      const accessToken = jwt.sign(accessTokenPayload, jwtSecret, {
        expiresIn: "15m",
      });

      const refreshToken = crypto.randomBytes(64).toString("hex");
      const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await storeRefreshToken(user.id, refreshToken, refreshTokenExpiry);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: refreshTokenExpiry,
      });

      res.json({
        success: true,
        message: "Đăng nhập thành công!",
        accessToken: accessToken,
        user: {
          id: user.id,
          username: user.username,
          gender: user.gender,
          Name: user.Name,
          avatar: user.avatar
            ? `${user.avatar}`
            : "logoT3V.png",
        },
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu!" });
    }
  } catch (err) {
    console.error("(Repair_Login.js)Lỗi đăng nhập:", err);
    res
      .status(500)
      .json({ success: false, message: "(Repair_Login.js)Lỗi server!" });
  }
});
////
// Cấu hình lưu file avatar
const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../../uploads/AvatarsUser");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const uploadAvatar = multer({ storage: avatarStorage });
// Route cập nhật thông tin cá nhân
router.post(
  "/user/profile",
  verifyToken,
  uploadAvatar.single("avatar"),
  async (req, res) => {
    // const userId = req.user.id;
    const {userId, Name, gender } = req.body;
    let avatarFile = null;
    try {
      // Lấy thông tin user hiện tại
      const user = await getUserById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy user." });
      }
      // Nếu upload avatar mới, xóa file cũ nếu có và tên file khác tên mới
      if (req.file) {
        if (user.avatar && user.avatar !== req.file.filename) {
          const oldAvatarPath = path.join(
            __dirname,
            "../../uploads/AvatarsUser",
            user.avatar
          );
          if (fs.existsSync(oldAvatarPath)) {
            fs.unlinkSync(oldAvatarPath);
          }
        }
        avatarFile = req.file.filename;
      } else {
        avatarFile = user.avatar;
      }
      // Cập nhật thông tin vào CSDL

      await SetInforUser(userId, Name, gender, avatarFile);
      res.json({
        success: true,
        message: "Cập nhật thành công!",
        user: {
          id: userId,
          Name: Name,
          gender: gender,
          avatar: avatarFile
            ? `${avatarFile}`
            : "logoT3V.png",
        },
      });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Lỗi server khi cập nhật profile." });
    }
  }
);

module.exports = router;
