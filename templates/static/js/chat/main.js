// templates/static/js/chat/main.js

import { state } from './state.js';
import { doms, showLoading, rendererFormList, renderMessages, renderMembers, renderSingleMessage } from './ui.js';
import { initializeSocket, sendEncryptedMessage } from './socket.js';
import { setupEventListeners } from './events.js';
import { apiService } from '../apiService.js';

// **ĐÂY LÀ NƠI XỬ LÝ MÃ HÓA KHI GỬI TIN NHẮN**
export async function executeSend() {
    const messageText = doms.messageInput.value.trim();
    if (messageText === "") return;

    doms.sendBtn.disabled = true;

    try {
        const members = state.membersCache.get(state.currentForumId) || [];
        const memberIds = members.map(m => m.id);

        if (memberIds.length === 0) {
            alert("Lỗi: Không tìm thấy thành viên trong nhóm để mã hóa.");
            return;
        }

        // 1. Mã hóa tin nhắn cho tất cả thành viên
        const encryptedPayload = await messageCipher.encryptForGroup(state.currentForumId, memberIds, messageText);

        // 2. Gửi gói tin đã mã hóa qua socket
        sendEncryptedMessage({
            forumId: state.currentForumId,
            mainCiphertext: encryptedPayload.mainCiphertext,
            distributionMessages: encryptedPayload.distributionMessages
        });
        
        // 3. Hiển thị tin nhắn của chính mình ngay lập tức
        renderSingleMessage({
            user_id: state.user.id,
            Name: state.user.Name,
            avatar: state.user.avatar,
            content_text: messageText,
            created_at: new Date().toISOString(),
        });

    } catch (error) {
        console.error("Lỗi khi mã hóa và gửi tin nhắn:", error);
        alert("Gửi tin nhắn thất bại. Vui lòng thử lại.");
    } finally {
        doms.messageInput.value = "";
        doms.messageInput.style.height = "auto";
        doms.messageInput.focus();
        doms.sendBtn.disabled = false;
    }
}

// Hàm chọn một nhóm chat
async function selectForum(id, name) {
    if (id === state.currentForumId) return;

    state.currentForumId = id;
    dom.chatHeaderTitle.textContent = name;
    showLoading(dom.messagesArea);
    showLoading(dom.memberListContainer);

    if (state.socket) {
        state.socket.emit("joinRoom", { forumId: id });
    }
    
    try {
        // Lấy danh sách thành viên và tin nhắn cũ
        const [membersRes, messagesRes] = await Promise.all([
            apiService.fetch(`/api/forums/${id}/members`),
            apiService.fetch(`/api/forums/${id}/messages`),
        ]);

        if (membersRes.success) {
            state.membersCache.set(id, membersRes.data);
            renderMembers(membersRes.data);
        }

        if (messagesRes.success) {
            // Hiển thị tin nhắn cũ (chưa được mã hóa) với thông báo
            const processedMessages = messagesRes.data.map(msg => {
                if (msg.content_type !== 'signal/group') {
                    msg.content_text = `[Tin nhắn cũ] ${msg.content_text}`;
                } else {
                    msg.content_text = `[Tin nhắn mã hóa cũ - cần cơ chế giải mã]`;
                }
                return msg;
            });
            renderMessages(processedMessages);
        }

    } catch (error) {
        console.error(`Lỗi khi tải dữ liệu cho nhóm ${id}:`, error);
    }
}

// Hàm khởi tạo chính của trang chat
async function initializeChatApp() {
    if (!state.user) {
        alert("Vui lòng đăng nhập.");
        window.location.href = "/login.html";
        return;
    }

    // Khởi tạo các thành phần
    initializeSocket();
    setupEventListeners();

    // Khởi tạo các khóa mã hóa (quan trọng)
    await signalStorage.init();
    await keyManager.initializeKeys();
    
    // Tải danh sách các nhóm chat
    try {
        const response = await apiService.fetch("/api/forums");
        if (response.success && response.data.length > 0) {
            rendererFormList(response.data, selectForum);
            document.querySelector(".group-item")?.classList.add("active");
            selectForum(response.data[0].id, response.data[0].name);
        } else {
            doms.chatHeaderTitle.textContent = "Chào mừng bạn!";
            doms.messagesArea.innerHTML = "<p style='text-align: center'>Tạo hoặc tham gia một nhóm để bắt đầu trò chuyện.</p>";
        }
    } catch (error) {
        console.error("Lỗi khi tải danh sách nhóm:", error);
    }
}

// Bắt đầu chạy ứng dụng
(async () => {
    await window.socketIoReady;
    initializeChatApp();
})();