const express = require('express'); //Tạo server
const multer = require('multer'); // Tạo cầu nối từ tương tác người dùng đến server
const path = require('path'); // Xử lý đường dẫn file
const fs = require('fs'); // fs = file system, xử lý file



const router = express.Router(); // Tạo router (bộ định tuyến)

// Tạo thư mục uploads nếu chưa tồn tại
const uploadsDir = path.join(__dirname, 'uploads');// "__dirname" là thư mục hiện tại của file đang chạy
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
// Cấu hình multer để lưu file
const storage = multer.diskStorage({
    destination: (req, file, cb) => { // Đặt thư mục lưu trữ file
        // Kiểm tra và tạo thư mục uploads nếu chưa tồn tại
        cb(null, uploadsDir); // "cb" là callback, trả về thư mục lưu trữ (đối số đầu tiên là lỗi, đối số thứ hai là thứ ta muốn trả về)
    },
    filename: (req, file, cb) => {
        // Tạo tên file duy nhất để tránh trùng lặp
        // Sử dụng timestamp và một số ngẫu nhiên để tạo tên file duy nhất
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Lọc tên file gốc để chỉ giữ lại các ký tự an toàn
        // Chỉ cho phép các ký tự chữ cái, số, dấu chấm, dấu gạch ngang và dấu gạch dưới
        const safeOriginalName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '');
        // Trả về tên file mới với tiền tố duy nhất
        cb(null, uniqueSuffix + '-' + safeOriginalName);
    }
});

// Giới hạn kích thước file upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // Giới hạn 100MB
    }
}).array('file', 10); // Cho phép upload tối đa 10 file cùng lúc

// API endpoint để upload file
    // 200 : Ok
    // 201 : Created thành công
    // 400 : Bad Request(Client gửi request không hợp lệ)
    // 401 : Unauthorized (Thiếu token/ không hợp lệ)
    // 403 : Forbidden,(không có quyền truy cập )
    // 404 : Not Found
    // 500 : Internal Server Error (lỗi phía server)
router.post('/upload', upload.array('file',10),async(req, res) => {
    try {
        // Kiểm tra xem có file nào được upload hay không
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Không có file nào được upload'
            });
        }

        // Mảng để lưu thông tin các file đã upload
        const uploadedFilesInfo = [];

        // Lặp qua từng file đã upload
        for (const file of req.files){
            const fileInfo = {
                filename: file.filename, // Tên file đã được lưu trữ
                originalname: file.originalname, // Tên gốc của file
                size: file.size, // Kích thước của file
                mimetype: file.mimetype // Kiểu MIME của file
                created_at: new Date().toISOString() // Thời gian tạo file
                
            };
            // Lưu thông tin file vào mảng
        }
        


    }
}