const fs = require("fs");
const path = require("path");
// SỬA LỖI 1: Import đúng execSync
const { execSync } = require("child_process");

const certsDir = path.join(__dirname, "certs");
if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir, { recursive: true });
}

const keyFile = path.join(certsDir, 'server.key');
const certFile = path.join(certsDir, 'server.cert');

console.log('🔧 Bắt đầu tạo SSL Certificate cho development...');

if (fs.existsSync(keyFile) && fs.existsSync(certFile)) {
    console.log('✅ Certificate đã tồn tại. Bỏ qua.');
    process.exit(0);
} else {
    // SỬA LỖI 2: Thêm try...catch để bắt lỗi nếu mkcert chưa được cài
    try {
        // Kiểm tra mkcert có được cài đặt không
        execSync('mkcert -version', { stdio: 'pipe' }); // stdio: 'pipe' để không in ra output của lệnh này

        // Tạo certificate
        console.log('⏳ Đang tạo certificate bằng mkcert...');
        execSync(`mkcert -key-file "${keyFile}" -cert-file "${certFile}" localhost 127.0.0.1`, {
            cwd: certsDir, // Chạy lệnh từ bên trong thư mục certs
            stdio: 'inherit' // Hiển thị output của lệnh này ra terminal
        });
        console.log('✅ Đã tạo SSL Certificate thành công!');

    } catch (error) {
        console.error('\n❌ LỖI: Không thể thực thi lệnh mkcert.');
        console.error('Vui lòng đảm bảo bạn đã cài đặt mkcert và thêm nó vào PATH hệ thống.');
        console.error('Xem hướng dẫn cài đặt tại: https://github.com/FiloSottile/mkcert');
        process.exit(1); // Thoát với mã lỗi
    }
}