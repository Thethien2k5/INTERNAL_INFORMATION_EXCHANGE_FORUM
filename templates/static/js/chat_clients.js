document.addEventListener('DOMContentLoaded', () => {
    // --- Các biến tham chiếu đến phần tử HTML ---
    const chatBox = document.getElementById('chat-box');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const imageButton = document.getElementById('image-button');
    const fileButton = document.getElementById('file-button');
    const imageInput = document.getElementById('image-input');
    const fileInput = document.getElementById('file-input');

    // --- Cấu hình Socket.IO và thông tin người dùng ---
    const socket = io("https://localhost:5000");

    // Giả sử sau khi đăng nhập, bạn đã lưu userId và forumId vào localStorage
    // Để test, chúng ta sẽ dùng giá trị mặc định.
    const CURRENT_USER_ID = localStorage.getItem('userId') || '1';
    const CURRENT_FORUM_ID = localStorage.getItem('forumId') || '1';

    // --- Các hàm trợ giúp ---
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    const displayMessage = (msg) => {
        const messageWrapper = document.createElement('div');
        // Phân biệt tin nhắn của mình và của người khác
        const messageType = msg.user_id.toString() === CURRENT_USER_ID ? 'sent' : 'received';
        messageWrapper.className = `message ${messageType}`;
        messageWrapper.dataset.messageId = msg.id;

        let contentHTML = '';

        if (msg.content_type === 'text') {
            contentHTML = `
                <div class="message-bubble">
                    <span>${msg.content_text}</span>
                </div>
            `;
        } else if (msg.content_type === 'file') {
            const isImage = msg.file_mime_type && msg.file_mime_type.startsWith('image/');
            const downloadUrl = `https://localhost:5000/uploads/${msg.file_name}`; // Đường dẫn để tải file

            if (isImage) {
                 contentHTML = `
                    <div class="message-bubble file-message image-message">
                         <a href="${downloadUrl}" target="_blank">
                            <img src="${downloadUrl}" alt="${msg.content_text}" style="max-width: 200px; border-radius: 10px;"/>
                         </a>
                    </div>
                `;
            } else {
                 contentHTML = `
                    <div class="message-bubble file-message">
                        <a href="${downloadUrl}" target="_blank" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 10px;">
                           <i class="fas fa-file-alt file-icon"></i>
                           <div class="file-info">
                               <div class="file-name">${msg.content_text}</div>
                               <div class="file-size">${formatFileSize(msg.file_size || 0)}</div>
                           </div>
                        </a>
                    </div>
                `;
            }
        }
        
        const timeHTML = `<div class="message-time">${new Date(msg.created_at).toLocaleTimeString('vi-VN')}</div>`;

        messageWrapper.innerHTML = contentHTML + timeHTML;
        chatBox.appendChild(messageWrapper);
        chatBox.scrollTop = chatBox.scrollHeight; // Tự động cuộn xuống dưới
    };

    /**
     * Gửi tin nhắn văn bản lên server.
     */
    const sendTextMessage = () => {
        const text = messageInput.value.trim();
        if (text) {
            socket.emit('sendMessage', {
                forumId: CURRENT_FORUM_ID,
                userId: CURRENT_USER_ID,
                messageText: text
            });
            messageInput.value = '';
            messageInput.focus();
        }
    };

    /**
     * Tải file lên server.
     * @param {FileList} files - Danh sách file từ thẻ input.
     */
    const uploadFiles = async (files) => {
        if (!files.length) return;

        const formData = new FormData();
        formData.append('userID', CURRENT_USER_ID);
        formData.append('forumID', CURRENT_FORUM_ID);

        for (const file of files) {
            formData.append('file', file);
        }
        
        try {
            //Lưu ý: Route này phải khớp với route bạn đã định nghĩa trong fileRouter.js
            const response = await fetch('https://localhost:5000/api/upload', { 
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Upload không thành công');
            }
            
            console.log('Upload thành công:', result);
            // Tin nhắn sẽ được hiển thị qua sự kiện real-time 'newMessage' từ server, không cần làm gì thêm ở đây.
        } catch (error) {
            console.error('Lỗi khi upload file:', error);
            alert('Đã có lỗi xảy ra khi gửi file.');
        }
    };


    // --- Gán sự kiện (Event Listeners) ---

    // 1. Gửi tin nhắn văn bản
    sendButton.addEventListener('click', sendTextMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Ngăn xuống dòng khi nhấn Enter
            sendTextMessage();
        }
    });

    // 2. Mở cửa sổ chọn file khi nhấn nút
    imageButton.addEventListener('click', () => imageInput.click());
    fileButton.addEventListener('click', () => fileInput.click());

    // 3. Xử lý khi người dùng đã chọn file
    imageInput.addEventListener('change', (e) => uploadFiles(e.target.files));
    fileInput.addEventListener('change', (e) => uploadFiles(e.target.files));


    // --- Lắng nghe sự kiện từ Socket.IO Server ---

    socket.on('connect', () => {
        console.log('Đã kết nối tới Socket.IO server với ID:', socket.id);
        // Tham gia vào phòng chat mặc định sau khi kết nối
        socket.emit('joinRoom', `forum_${CURRENT_FORUM_ID}`);
        console.log(`Đã yêu cầu tham gia phòng: forum_${CURRENT_FORUM_ID}`);
    });

    socket.on('newMessage', (msg) => {
        console.log('Nhận được tin nhắn mới:', msg);
        displayMessage(msg);
    });

    socket.on('disconnect', () => {
        console.log('Đã mất kết nối tới server.');
        alert('Mất kết nối với máy chủ chat!');
    });
    
    socket.on('connect_error', (err) => {
        console.error('Lỗi kết nối Socket.IO:', err.message);
    });
});