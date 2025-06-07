// File mục đích là chỉ để xử lý các sự kiện real-time


// Import hàm lưu tin nhắn từ module db.Messages 
const { saveMessage } = require('../mysql/db.Messages');


// Hàm khởi tạo Socket.IO
function initializeSocket(io) {
    // Bắt (lắng nghe) sự kiện client kết nối tới server
    io.on('connection', (socket) => {
        console.log('Client đã kết nối', socket.id);

       // Bắt (lắng nghe) sự kiện client 
        socket.on('joinRoom', (forumId) => {
            // Gán tên phòng (room) cho socket
            socket.join(forumId);
            console.log(`Client ${socket.id} tham gia ${forumId}`);
        });

        // Khi client gửi tin nhắn đến nhóm forum
         socket.on('sendMessage', async (data) => {
            //Gán giá trị phong cách ChatGPT chỉ
            const { forumId, userId, messageText } = data;

            // Tạo Object chứa thông tin tin nhắn để lưu vào CSDL
            const messageData = {
                forumId,
                userId,
                contentType: 'text',
                contentText: messageText
            };
        
            // Gọi hàm lưu tin nhắn vào CSDL
            const isSaved = await saveMessage(messageData);
            // Nếu lưu thành công, gửi tin nhắn đến tất cho các client khác trong nhóm
            if (isSaved) {
                // Tạo dữ Object để gửi đi cho client
                const messageForClient = {
                    id: newMessageId,
                    user_id: userId,
                    content_type: 'text',
                    content_text: messageText,
                    created_at: new Date().toISOString()
                };
                // .to (Gửi sự kiện đến ....)
                // .emit (Phát sự kiện tới client hiện tại gửi)
                io.to(`forum_${forumId}`).emit('newMessage', messageForClient);
            }
        });


        // Khi client ngắt kết nối khỏi nhóm forum
        socket.on('disconnect', () => {
            console.log('Client ngắt kết nối :', socket.id);
        });
    });
}

module.exports = { initializeSocket };
