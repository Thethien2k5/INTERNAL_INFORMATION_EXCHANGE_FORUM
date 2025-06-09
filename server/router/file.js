const express = require('express'); //Tạo server
const multer = require('multer'); // Tạo cầu nối từ tương tác người dùng đến server
const path = require('path'); // Xử lý đường dẫn file
const fs = require('fs'); // fs = file system, xử lý file
const { saveMessage } = require('../../mysql/db.Messages'); // Import hàm saveMessage từ fileController



// --------------------Tạo router--------------------
function createFileRouter (io){
    const router = express.Router(); // Tạo router (bộ định tuyến)

    // Tạo thư mục uploads nếu chưa tồn tại
    const uploadsDir = path.join(__dirname,'..','..','uploads');// "__dirname" là thư mục hiện tại của file đang chạy
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
    });

    // API endpoint để upload file
        // 200 : Ok
        // 201 : Created thành công
        // 400 : Bad Request(Client gửi request không hợp lệ)
        // 401 : Unauthorized (Thiếu token/ không hợp lệ)
        // 403 : Forbidden,(không có quyền truy cập )
        // 404 : Not Found
        // 500 : Internal Server Error (lỗi phía server)

    // Định nghĩa route để upload file
    router.post('/upload', upload.array('file',10),async(req, res) => {
        const {forumID, userID} = req.body; // Lấy forumID và userID từ body của request
        
        if (!forumID || !userID) {
            return res.status(400).json({ error: 'Không thấy thông tin phòng hoặc user' });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Không có file nào được upload.' });
        }

        try{
            const uploadedFiles = [];
            for (const file of req.files){
                // Thông tin tên file, đường dẫn, kích thước và loại MIME
                const fileInfo = {
                    filename: file.filename,
                    filePath: file.path,
                    fileSize: file.size,
                    fileMimeType: file.mimetype,
                };
                // Thông tin tin nhắn 
                const messageData = {
                    fileInfo: fileInfo, // Thông tin file ở phía trên đó
                    forumID: forumID,
                    userID: userID,
                    contentType: 'file', // Đánh dấu đây là tin nhắn dạng file
                    contentText: file.originalname, // Lưu tên gốc của file vào content_text
                };

                const saveMessage = await saveMessage(messageData); // Lưu tin nhắn vào cơ sở dữ liệu
                
                // Kiểm tra xem việc lưu tin nhắn có thành công không
                if (saveMessage.success) {
                    // Nếu lưu thành công, thêm thông tin file vào mảng uploadedFiles
                    uploadedFiles.push(saveMessage.data); // Thêm thông tin file vào mảng
                    // Gửi sự kiện 'newMessage' đến tất cả client trong phòng chat
                    io.to(forumID).emit('newMessage', saveMessage.data); 
                } 
                res.status(201).json({
                    message: 'File uploaded thành công',
                    files: uploadedFiles // Trả về thông tin file đã upload
                });
            }
        }catch (error) {
            console.error('Lỗi khi upload file:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi upload file.' });
        }
        
    });
    return router;
}
module.exports = createFileRouter; // Xuất router để sử dụng trong các file khác