// DOM Elements
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const moreOptionsBtn = document.getElementById('moreOptionsBtn');
const optionsDropdown = document.getElementById('optionsDropdown');
const copyBtn = document.getElementById('copyBtn');
const unpinBtn = document.getElementById('unpinBtn');
const messageContextMenu = document.getElementById('messageContextMenu');
const pinMessageBtn = document.getElementById('pinMessageBtn');
const replyMessageBtn = document.getElementById('replyMessageBtn');
const shareMessageBtn = document.getElementById('shareMessageBtn');
const pinnedMessagesSection = document.getElementById('pinnedMessagesSection');
const pinnedMessagesList = document.getElementById('pinnedMessagesList');
const collapsePinnedBtn = document.getElementById('collapsePinnedBtn');



// -------------------!Code của Thông------------------------------------------
const socket = io("https://localhost:5000");


function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}







// Message Store
let messages = [];
let pinnedMessages = new Set();
let selectedMessage = null;
let replyingTo = null;


// ~ Đoạn này sẽ được sử dụng lại (Thông)
// Message Templates
const createMessageElement = (message) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.type}`;
    messageDiv.dataset.messageId = message.id;

    // Add reply container if this message is a reply
    if (message.replyTo) {
        const replyContainer = document.createElement('div');
        replyContainer.className = 'reply-container';
        const replyMessage = messages.find(m => m.id === message.replyTo);
        if (replyMessage) {
            replyContainer.textContent = replyMessage.text;
            messageDiv.appendChild(replyContainer);
        }
    }

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';

    const textSpan = document.createElement('span');
    textSpan.textContent = message.text;
    bubbleDiv.appendChild(textSpan);

    // Create options button
    const optionsBtn = document.createElement('button');
    optionsBtn.className = 'message-options-btn';
    optionsBtn.innerHTML = '<i class="fas fa-ellipsis-h"></i>';
    optionsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showContextMenu(e, messageDiv);
    });
    bubbleDiv.appendChild(optionsBtn);

    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = formatTime(message.timestamp);

    messageDiv.appendChild(bubbleDiv);
    messageDiv.appendChild(timeDiv);

    return messageDiv;
};

// Message Handling
const addMessage = (message) => {
    const messageElement = createMessageElement(message);
    messagesContainer.appendChild(messageElement);
    scrollToBottom();
};

const sendMessage = () => {
    const text = messageInput.value.trim();
    if (text) {
        socket.emit('sendMessage', {
            forumID: '1',
            user: '1',
            messageText: text
        });
        messageInput.value = ''; // Xóa ô nhập nội dung sau khi gửi
        messageInput.focus(); // Đặt lại focus vào ô nhập nội dung
    }
};

async function uploadFile (file) {
    if (!file) return;

    const formData = new FormData();
    formData.append('forumID', '1'); // Thay bằng ID phòng chat thực tế
    formData.append('userID', '1'); // Thay bằng ID người dùng thực tế

    for (const file of files){
        formData.append('file', file);
    }

    try {
        const response = await fetch('https://localhost:5000/api/upload', {
            method: 'POST',
            body: formData,
        });
       const result = await response.json();
        if (response.ok) {
            console.log('Upload thành công:', result.message);
            // Tin nhắn file sẽ được server gửi về qua socket, không cần làm gì thêm
        } else {
            alert('Lỗi upload file: ' + result.error);
        }
    } catch (error) {
        console.error('Lỗi fetch khi upload:', error);
        alert('Không thể kết nối đến server để upload file.');
    } finally {
        // Ẩn spinner/loading
    }
}

socket.on('connect', () => {
    console.log('Đã kết nối tới Socket.IO server với ID:', socket.id);
    // Tham gia phòng chat sau khi kết nối
    socket.emit('joinRoom', 'forum_1'); // Tên phòng phải khớp với server
});

socket.on('newMessage', (message) => {
    console.log('Nhận tin nhắn mới:', message);
    addMessage(message);
});

socket.on('disconnect', () => {
    console.log('Đã mất kết nối với Socket.IO server.');
});


// --- DOM Event Listeners ---
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Kích hoạt input ẩn khi nhấn nút
sendImageBtn.addEventListener('click', () => imageInput.click());
attachFileBtn.addEventListener('click', () => fileInput.click());

// Xử lý khi người dùng đã chọn file
imageInput.addEventListener('change', (e) => uploadFiles(e.target.files));
fileInput.addEventListener('change', (e) => uploadFiles(e.target.files));






// Utility Functions
const formatTime = (date) => {
    return new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

const scrollToBottom = () => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
};

// Dropdown Menu Functionality
const toggleDropdown = () => {
    optionsDropdown.classList.toggle('show');
};

const handleCopy = () => {
    // Get all messages text
    const messagesText = messages.map(msg => msg.text).join('\n');
    navigator.clipboard.writeText(messagesText)
        .then(() => {
            alert('Đã sao chép tin nhắn vào clipboard!');
            optionsDropdown.classList.remove('show');
        })
        .catch(err => {
            console.error('Không thể sao chép:', err);
            alert('Không thể sao chép tin nhắn!');
        });
};

// Pinned Messages Section
const togglePinnedSection = () => {
    pinnedMessagesSection.classList.toggle('collapsed');
    updateCollapseButtonText();
};

const updateCollapseButtonText = () => {
    const isCollapsed = pinnedMessagesSection.classList.contains('collapsed');
    collapsePinnedBtn.innerHTML = isCollapsed ?
        'Mở rộng <i class="fas fa-chevron-down"></i>' :
        'Thu gọn <i class="fas fa-chevron-up"></i>';
};

const createPinnedMessageElement = (message) => {
    const div = document.createElement('div');
    div.className = 'pinned-message';
    div.dataset.messageId = message.id;

    div.innerHTML = `
        <div class="pinned-message-content">
            <div class="pinned-message-text">${message.text}</div>
            <div class="pinned-message-info">
                ${message.type === 'sent' ? 'Bạn' : 'Người khác'} · ${formatTime(message.timestamp)}
            </div>
        </div>
        <div class="pinned-message-options">
            <button class="unpin-btn" title="Bỏ ghim">
                <i class="fas fa-thumbtack"></i>
            </button>
        </div>
    `;

    // Add click handler to scroll to original message
    div.addEventListener('click', () => {
        const originalMessage = document.querySelector(`.message[data-message-id="${message.id}"]`);
        if (originalMessage) {
            originalMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            originalMessage.classList.add('highlight');
            setTimeout(() => originalMessage.classList.remove('highlight'), 2000);
        }
    });

    // Add unpin handler
    div.querySelector('.unpin-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        unpinMessage(message.id);
    });

    return div;
};

const updatePinnedMessagesList = () => {
    // Clear existing pinned messages
    pinnedMessagesList.innerHTML = '';

    // Add all pinned messages
    const pinnedMessageElements = Array.from(pinnedMessages)
        .map(id => messages.find(m => m.id === id))
        .filter(Boolean)
        .map(createPinnedMessageElement);

    pinnedMessageElements.forEach(element => {
        pinnedMessagesList.appendChild(element);
    });

    // Update pinned count in header
    const pinnedCount = pinnedMessages.size;
    document.querySelector('.pin-count').textContent = pinnedCount > 0 ? `+${pinnedCount} ghim` : '5 ghim';
    document.querySelector('.pinned-header span').textContent = `Danh sách ghim (${pinnedCount})`;

    // Show/hide pinned section based on whether there are pinned messages
    pinnedMessagesSection.style.display = pinnedCount > 0 ? 'block' : 'none';
};

const unpinMessage = (messageId) => {
    pinnedMessages.delete(messageId);
    const messageElement = document.querySelector(`.message[data-message-id="${messageId}"]`);
    if (messageElement) {
        messageElement.classList.remove('pinned');
    }
    updatePinnedMessagesList();
};

// Context Menu Functionality
const showContextMenu = (e, messageElement) => {
    // Hide any existing shown menus
    hideContextMenu();

    selectedMessage = messageElement;

    // Get the button position
    const rect = e.target.closest('.message-options-btn').getBoundingClientRect();

    // Position the context menu next to the button
    messageContextMenu.style.top = `${rect.top}px`;

    if (messageElement.classList.contains('sent')) {
        messageContextMenu.style.left = `${rect.left - 160}px`; // Menu width + some padding
    } else {
        messageContextMenu.style.left = `${rect.right}px`;
    }

    messageContextMenu.classList.add('show');
};

const hideContextMenu = () => {
    messageContextMenu.classList.remove('show');
    selectedMessage = null;
};

// Update pin message handler
const handlePinMessage = () => {
    if (selectedMessage) {
        const messageId = selectedMessage.dataset.messageId;

        if (!pinnedMessages.has(messageId)) {
            // Pin the message
            pinnedMessages.add(messageId);
            selectedMessage.classList.add('pinned');
            updatePinnedMessagesList();
        }

        hideContextMenu();
    }
};

// Update unpin all handler
const handleUnpin = () => {
    pinnedMessages.clear();
    document.querySelectorAll('.message.pinned').forEach(msg => {
        msg.classList.remove('pinned');
    });
    updatePinnedMessagesList();
    optionsDropdown.classList.remove('show');
};

// Reply Functionality
const handleReply = () => {
    if (selectedMessage) {
        replyingTo = selectedMessage.dataset.messageId;
        messageInput.placeholder = 'Trả lời tin nhắn...';
        messageInput.focus();
        hideContextMenu();
    }
};

const clearReplyState = () => {
    replyingTo = null;
    messageInput.placeholder = 'Nhập @, tin nhắn tới Nhóm lập trình Mạng';
};

// Share Functionality
const handleShare = () => {
    if (selectedMessage) {
        const messageText = selectedMessage.querySelector('.message-bubble span').textContent;
        navigator.clipboard.writeText(messageText)
            .then(() => {
                alert('Đã sao chép tin nhắn! Bạn có thể chia sẻ ngay bây giờ.');
                hideContextMenu();
            })
            .catch(err => {
                console.error('Không thể sao chép tin nhắn:', err);
                alert('Không thể sao chép tin nhắn!');
            });
    }
};

// !Tạm thời bỏ phần này đi (Thông)
/*
// Event Listeners
sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Event Listeners for Dropdown
moreOptionsBtn.addEventListener('click', toggleDropdown);
copyBtn.addEventListener('click', handleCopy);
unpinBtn.addEventListener('click', handleUnpin);

// Pin Message Event Listener
pinMessageBtn.addEventListener('click', handlePinMessage);

// Event Listeners
document.addEventListener('click', (e) => {
    // Hide context menu when clicking outside
    if (!messageContextMenu.contains(e.target)) {
        hideContextMenu();
    }

    // Existing dropdown click handler
    if (!moreOptionsBtn.contains(e.target) && !optionsDropdown.contains(e.target)) {
        optionsDropdown.classList.remove('show');
    }
});

// Add new event listeners
replyMessageBtn.addEventListener('click', handleReply);
shareMessageBtn.addEventListener('click', handleShare);

// Escape key to clear reply state
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        clearReplyState();
    }
});

// Action Buttons
document.querySelectorAll('.input-actions button').forEach(button => {
    button.addEventListener('click', () => {
        alert('Tính năng này đang được phát triển!');
    });
});

// Event Listeners
collapsePinnedBtn.addEventListener('click', togglePinnedSection);
*/


// Initial Messages
/*const initialMessages = [
    {
        text: 'Chào mừng bạn đến với nhóm chat!',
        type: 'received',
        timestamp: new Date(Date.now() - 60000)
    },
    {
        text: 'Hãy bắt đầu cuộc trò chuyện.',
        type: 'received',
        timestamp: new Date()
    }
];

// Load initial messages
initialMessages.forEach(msg => {
    addMessage(msg.text, msg.type);
});
*/

// Initialize pinned section
updatePinnedMessagesList(); 