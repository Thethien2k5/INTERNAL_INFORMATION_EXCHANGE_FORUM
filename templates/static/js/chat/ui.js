import { state } from "./state.js";

// Tập hợp các dom
export const doms = {
    sendBtn: document.getElementById("sendBtn"),
    messageInput: document.getElementById("messageInput"),
    messagesArea: document.getElementById("messagesArea"),
    memberListContainer: document.getElementById("member-list"),
    overlay: document.getElementById("auth-overlay"),
    groupList: document.getElementById("groupList"),
    chatHeaderTitle: document.querySelector(".chat-title h2"),
    fileStagingArea: document.getElementById("file-staging-area"),
    imageBtn: document.getElementById("imageBtn"),
    fileBtn: document.getElementById("fileBtn"),
    imageInput: document.getElementById("imageInput"),
    fileInput: document.getElementById("fileInput"),
};

// Hàm in ra các tin nhắn
export function renderSingleMessage(msg) {
    const isSentByMe = parseInt(msg.user_id) === parseInt(state.user.id);
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${isSentByMe ? "sent" : "received"}`;

    const messageTime = new Date(msg.created_at).toLocaleTimeString("vi-VN", {
        hour: "2-digit", minute: "2-digit",
    });

    // Sau khi giải mã, mọi tin nhắn đều là dạng text
    const messageBubbleContent = `<div class="message-bubble">${msg.content_text.replace(/\n/g, "<br>")}</div>`;

    const avatarUrl = msg.avatar ? `/uploads/${msg.avatar}` : "/templates/static/images/logoT3V.png";
    messageDiv.innerHTML = `
        <div class="message-avatar"><img src="${avatarUrl}" alt="avatar"></div>
        <div class="message-content">
            <div class="message-header">
                <span class="message-sender">${isSentByMe ? "Bạn" : msg.Name}</span>
                <span class="message-time">${messageTime}</span>
            </div>
            ${messageBubbleContent}
        </div>`;
    doms.messagesArea.appendChild(messageDiv);
    scrollToBottom();
}

// Vẽ danh sách thành viên
export function renderMembers(members) {
    if (!doms.memberListContainer) return;
    doms.memberListContainer.innerHTML = "";
    members.forEach(member => {
        const avatarUrl = member.avatar ? `/uploads/${member.avatar}` : "/templates/static/images/logoT3V.png";
        const memberItem = document.createElement("div");
        memberItem.className = "member-item";
        memberItem.innerHTML = `
            <div class="member-avatar"><img src="${avatarUrl}" alt="avatar"></div>
            <div class="member-info"><div class="member-name">${member.Name}</div></div>`;
        doms.memberListContainer.appendChild(memberItem);
    });
}

// Vẽ toàn bộ danh sách tin nhắn
export function renderMessages(messages) {
    doms.messagesArea.innerHTML = "";
    if (!messages || messages.length === 0) {
        doms.messagesArea.innerHTML = '<p style="text-align: center; color: #888;">Chưa có tin nhắn nào trong nhóm này.</p>';
        return;
    }
    messages.forEach(msg => renderSingleMessage(msg));
}


// Vẽ danh sách các nhóm chat
export function rendererFormList(forums, onForumSelectCallback) {
    if (!doms.groupList) return;
    doms.groupList.innerHTML = "";
    forums.forEach(forum => {
        const forumItem = document.createElement("div");
        forumItem.className = "group-item";
        forumItem.innerHTML = `
            <div class="group-item-avatar"><i class="fas fa-users"></i></div>
            <div class="group-item-info">
                <div class="group-item-name">${forum.name}</div>
                <div class="group-item-lastmsg">Topic: ${forum.topic || "Chưa có"}</div>
            </div>`;
        // Gắn sự kiện click, gọi lại hàm selectForum trong main.js
        forumItem.addEventListener("click", () => {
            document.querySelectorAll(".group-item").forEach(item => item.classList.remove("active"));
            forumItem.classList.add("active");
            onForumSelectCallback(forum.id, forum.name);
        });
        doms.groupList.appendChild(forumItem);
    });
}

export function showLoading(element) {
    if (element) element.innerHTML = '<div class="loader"></div>';
}

function scrollToBottom() {
    doms.messagesArea.scrollTop = doms.messagesArea.scrollHeight;
}