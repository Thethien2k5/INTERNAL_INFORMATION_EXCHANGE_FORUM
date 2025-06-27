// File mục đích là chỉ để xử lý các sự kiện real-time


// Import hàm lưu tin nhắn từ module db.Messages 
const jwt = require('jsonwebtoken');
const { saveMessage } = require('../mysql/db.Messages');
const {jwtSecret } = require('./config');

// Hàm khởi tạo Socket.IO
function initializeSocket(io) {
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;  // lấy token từ handshake auth mà client gửi lên khi kết nối được
        if (!token) {
            return next (new Error('Lỗi xác thực: Không có tìm thấy token'));
        }

        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                return next(new Error('Lỗi xác thực: Token không hợp lệ hoặc đã hết hạn'));
            }

            if (!decoded.userId) {
                console.error(`[AUTH] Kết nối bị từ chối (userId không có trong token payload): ${socket.id}`);
                return next(new Error('Authentication error: userId missing in token.'));
            }
            // Nếu token hợp lê,
            socket.user = decoded; // Lưu thông tin người dùng đã giải mã vào socket
            next(); // Cho phép kết nối tiếp tục
        });
    });

    // Bắt (lắng nghe) sự kiện client kết nối tới server
    io.on('connection', (socket) => {
        console.log('Client đã kết nối', socket.id);

       // Bắt (lắng nghe) sự kiện client 
        socket.on('joinRoom', (data) => {
            const forumId = data ? data.forumId : null;
            if (forumId){
                // Gán tên phòng (room) cho socket
                const roomName = `forum_${forumId}`
                socket.join(roomName);
                console.log(`Client ${socket.id} tham gia ${forumId}`);
            }else{
                console.log(`Client ${socket.id} gửi yêu cầu nhưng bị sai dữ liệu`)
            }
        });

        // Khi client gửi tin nhắn đến nhóm forum
        socket.on('sendMessage', async (data) => {

            try{
                const userId = socket.user.userId; // Lấy userId từ thông tin người dùng đã giải mã trong socket
                //Gán giá trị phong cách ChatGPT chỉ~
                const { forumId, messageText } = data;
                if (!forumId || !userId || !messageText) {
                    console.error('Dữ liệu tin nhắn không hợp lệ:', data);
                    return;
                }
                // Tạo Object chứa thông tin tin nhắn để lưu vào CSDL
                const messageData = {
                    forumId,
                    userId,
                    contentType: 'text',
                    contentText: messageText
                };
            
                // Gọi hàm lưu tin nhắn vào CSDL
            const savedResult = await saveMessage(messageData);
                // Nếu lưu thành công, gửi tin nhắn đến tất cho các client khác trong nhóm
            if (savedResult && savedResult.success) {
                    // Tạo dữ Object để gửi đi cho client
                    const messageForClient = savedResult.data;
                    const roomName = `forum_${forumId}`
                    // .to (Gửi sự kiện đến ....)
                    // .emit (Phát sự kiện tới client hiện tại gửi)
                    io.to(roomName).emit('newMessage', messageForClient);
                    console.log(`Broadcast message to room ${roomName}`);
                }
            }catch(error){
                console.error('Lỗi khi xử lý tin nhắn:', error);

            }
        });


        // Khi client ngắt kết nối khỏi nhóm forum
        socket.on('disconnect', () => {
            console.log('Client ngắt kết nối :', socket.id);
        });
    });
}

module.exports = { initializeSocket };
