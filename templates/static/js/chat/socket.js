// templates/static/js/chat/socket.js

import { API_CONFIG } from '../app-config.js';
import { state } from './state.js';
import { renderSingleMessage } from './ui.js';

// **ĐÂY LÀ NƠI XỬ LÝ MÃ HÓA KHI NHẬN TIN NHẮN**
async function handleNewEncryptedMessage(encryptedPayload) {
    if (encryptedPayload.senderId === state.user.id) return; // Bỏ qua tin nhắn của chính mình

    try {
        const decryptedText = await messageCipher.decryptGroupMessage(
            encryptedPayload.forumId,
            encryptedPayload.senderId,
            encryptedPayload
        );
        
        const members = state.membersCache.get(encryptedPayload.forumId) || [];
        const senderInfo = members.find(m => m.id === encryptedPayload.senderId) || { Name: 'Thành viên', avatar: null };

        // Tạo object tin nhắn để vẽ lên giao diện
        renderSingleMessage({
            user_id: encryptedPayload.senderId,
            Name: senderInfo.Name,
            avatar: senderInfo.avatar,
            content_text: decryptedText,
            created_at: new Date().toISOString(),
        });

    } catch (error) {
        console.error("Lỗi giải mã tin nhắn:", error);
        renderSingleMessage({
            user_id: encryptedPayload.senderId,
            Name: "Lỗi",
            content_text: "⚠️ Không thể giải mã tin nhắn này.",
            created_at: new Date().toISOString(),
        });
    }
}

// Khởi tạo kết nối Socket.IO
export function initializeSocket() {
    state.socket = io(API_CONFIG.getApiUrl(), {
        auth: { token: localStorage.getItem("accessToken") },
    });

    state.socket.on("connect", () => console.log("Socket.IO đã kết nối."));
    state.socket.on("newGroupMessage", handleNewEncryptedMessage); // Lắng nghe sự kiện mới
    state.socket.on("connect_error", (err) => console.error("Lỗi kết nối:", err.message));
}

// Hàm để gửi tin nhắn đã mã hóa lên server
export function sendEncryptedMessage(payload) {
    if (state.socket) {
        state.socket.emit("sendGroupMessage", payload);
    }
}