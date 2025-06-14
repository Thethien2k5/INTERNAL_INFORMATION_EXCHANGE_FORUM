// Hàm lấy địa chỉ local IP 
const { get } = require('http');
const os = require('os');

const BE_PORT =5000; // Cổng của BE_Server
const FE_PORT = 5500; // Cổng của FE_Server

function getLocalIP(){
        const networkInterfaces = os.networkInterfaces(); // Lấy thông tin các giao diện mạng
        const ips =[]; // Mảng để lưu trữ các địa chỉ IP
        for (const name of Object.keys(networkInterfaces)) { // Duyệt qua từng giao diện mạng
            if (name.includes('VMware') || name.includes('VirtualBox') || name.includes('VBox')) {
                continue; // Nếu tên chứa các từ này, bỏ qua và xét card mạng tiếp theo
            }       
            const iface = networkInterfaces[name];// Lấy thông tin của giao diện mạng
            for (const alias of iface) { // Duyệt qua từng alias (địa chỉ IP) của giao diện mạng
                if (alias.family === 'IPv4' && !alias.internal) { // Chỉ lấy địa chỉ IPv4 không phải là địa chỉ nội bộ
                    ips.push(alias.address) // Lưu địa chỉ IP vào mảng
                }
            }    
        }
        return ips;
}

const localIP = getLocalIP(); // Lấy địa chỉ IP cục bộ

const allowedOrigins = [
    `https://localhost:${FE_PORT}`, // Địa chỉ của FE_Server
    ...localIP.map(ip => `https://${ip}:${FE_PORT}`) // Thêm các địa chỉ IP cục bộ với cổng FE_Server
];

//*Lưu ý: (...) là toán tử spread, nó sẽ "phá vỡ" mảng localIP thành các phần tử riêng lẻ và thêm chúng vào mảng allowedOrigins
// ví dụ: không có (...) thì mảng sẽ là ["https://localhost:5500", ["https://192.168.1.6]]
// Nếu có (...) thì mảng sẽ là ["https://localhost:5500", "https://192.168.1.6"]
const jwtSecret = 'c89b76c82f76f7a6a4e3a9c1b3f7e6e3d2a1b0c9f8d7e6d5c4b3a2a1b0c9f8d7e6d5c4b3a2a1b0c9f8d7e6d5c4b3a2a1b0c9f8d7e6d5c4b3a2a1b0c9f8d7e6d5';
module.exports = {
    allowedOrigins, // Danh sách các địa chỉ được phép truy cập
    BE_PORT, // Cổng của BE_Server
    FE_PORT, // Cổng của FE_Server
    jwtSecret, // Mã bí mật dùng để mã hóa JWT
    getLocalIP // Hàm lấy địa chỉ IP cục bộ 
};