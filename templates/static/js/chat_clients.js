
(async function (){

    await window.socketIoReady;
  // ---------------------------------DOM Elements--------------------------------

    const sendBtn = document.getElementById('sendBtn');
    const messageInput = document.getElementById('messageInput');
    const messagesArea = document.getElementById('messagesArea');
    const memberListContainer = document.getElementById('member-list');
    const overlay = document.getElementById('auth-overlay');
    const groupList = document.getElementById('groupList');
    const chatHeaderTitle = document.querySelector('.chat-title h2');
    const fileStagingArea = document.getElementById('file-staging-area');

    // MỚI: Lấy thêm các nút và input mới
    const imageBtn = document.getElementById('imageBtn');
    const fileBtn = document.getElementById('fileBtn');
    const imageInput = document.getElementById('imageInput');
    const fileInput = document.getElementById('fileInput');

    // --------------------------------- Global State --------------------------------
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    let currentForumId = null;
    let socket;
    
    let stagedFiles = [];
    const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB
    const MAX_FILE_COUNT = 10;

    // ======================== XÁC THỰC NGƯỜI DÙNG ========================
    if (!user || !localStorage.getItem('accessToken')) {
        if (overlay) {
            overlay.style.display = 'flex';
            setTimeout(() => overlay.classList.add('show'), 10);
        }
        setTimeout(() => {
            window.location.replace('/login.html');
        }, 2000);
        return;
    }

    // ======================== KHỞI TẠO SOCKET.IO ========================
    function initializeSocket() {
        socket = io(API_CONFIG.getApiUrl(), {
            auth: { token: localStorage.getItem('accessToken') }
        });
        socket.on('connect', () => console.log('Kết nối thành công với Socket.IO', socket.id));
        socket.on('newMessage', (message) => {
            if (message.forum_id === currentForumId) {
                renderSingleMessage(message, false);
                scrollToBottom();
            }
        });
        // MỚI: Lắng nghe sự kiện lỗi khi gửi tin
        socket.on('sendMessageError', (error) => {
            alert(`Lỗi gửi tin nhắn: ${error.message}`);
        });
    }
    // ======================== TIN NHẮN VÀ FILE ===================================
    // --------------------- Render từng tin nhắn + file đã gửi --------------------------
function renderSingleMessage(msg, isLocal) {
        const messageDiv = document.createElement('div');
        const isSentByMe = msg.user_id === user.id;
        messageDiv.className = `message ${isSentByMe ? 'sent' : 'received'}`;
        if (isLocal) messageDiv.style.opacity = '0.7'; // Làm mờ tin nhắn đang gửi

        const messageTime = new Date(msg.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

        let messageBubbleContent = '';
        if (msg.content_type === 'text') {
            messageBubbleContent = `<div class="message-bubble">${msg.content_text.replace(/\n/g, '<br>')}</div>`;
        } else {
            const dataAttributes = `data-file-path="${msg.file_path || ''}" data-file-name="${msg.file_name || ''}"`;
            const downloadPath = `${API_CONFIG.getApiUrl()}/uploads/${msg.file_path.split(/[\\/]/).pop()}`;
            const fileSize = msg.file_size ? (msg.file_size / 1024 / 1024).toFixed(2) + ' MB' : '';
            messageBubbleContent = `
            <div class="message-bubble file-message" ${dataAttributes}>
                <div class="file-icon-wrapper">
                    <i class="fas fa-file-alt"></i>
                </div>
                <div class="file-info">
                    <div class="file-name">${msg.file_name || 'Tập tin'}</div>
                    <div class="file-size">${fileSize}</div>
                </div>
                <a href="${downloadPath}" download="${msg.file_name}" class="download-button" title="Tải xuống">
                    <i class="fas fa-download"></i>
                </a>
            </div>`;
    }

    messageDiv.innerHTML = `
            <div class="message-avatar">
                <img src="${
                  msg.avatar || "/templates/static/images/khongbiet.jpg"
                }" alt="avatar">
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-sender">${
                      isSentByMe ? "Bạn" : msg.username
                    }</span>
                    <span class="message-time">${messageTime}</span>
                </div>
                ${messageBubbleContent}
            </div>
        `;
        messagesArea.appendChild(messageDiv);
    }
    
    function renderMessages(messages) {
        messagesArea.innerHTML = '';
        if (messages.length === 0) {
            messagesArea.innerHTML = '<p style="text-align: center; color: #888;">Chưa có tin nhắn nào. Hãy là người đầu tiên!</p>';
            return;
        }
        messages.forEach(msg => renderSingleMessage(msg, false));
        scrollToBottom();
    }

    function updateStagingArea() {
        fileStagingArea.innerHTML = '';
        let totalSize = 0;
        stagedFiles.forEach((file, index) => {
            totalSize += file.size;
            const fileItem = document.createElement('div');
            fileItem.className = 'staged-file-item';
            fileItem.innerHTML = `
                <span class="staged-file-icon"><i class="fas fa-file"></i></span>
                <div class="staged-file-info">
                    <div class="staged-file-name">${file.name}</div>
                    <div class="staged-file-size">${(file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
                <button class="remove-staged-file" data-index="${index}">&times;</button>
            `;
            fileStagingArea.appendChild(fileItem);
        });

        sendBtn.disabled = messageInput.value.trim() === '' && stagedFiles.length === 0;

        document.querySelectorAll('.remove-staged-file').forEach(button => {
            button.addEventListener('click', (e) => {
                const indexToRemove = parseInt(e.currentTarget.getAttribute('data-index'), 10);
                stagedFiles.splice(indexToRemove, 1);
                updateStagingArea();
            });
        });
    }

    function handleFileSelection(event) {
        const files = Array.from(event.target.files);
        let currentTotalSize = stagedFiles.reduce((acc, file) => acc + file.size, 0);

        if (stagedFiles.length + files.length > MAX_FILE_COUNT) {
            alert(`Bạn chỉ có thể chọn tối đa ${MAX_FILE_COUNT} tệp.`);
            return;
        }

        for (const file of files) {
            if (currentTotalSize + file.size > MAX_TOTAL_SIZE) {
                alert(`Tổng dung lượng tệp không được vượt quá 100MB.`);
                break;
            }
            stagedFiles.push(file);
            currentTotalSize += file.size;
        }

        updateStagingArea();
        fileInput.value = '';
        imageInput.value = ''; 
    }

    async function executeSend() {
        const messageText = messageInput.value.trim();
        
        if (messageText === '' && stagedFiles.length === 0) return;
        
        sendBtn.disabled = true;

        try {
            if (stagedFiles.length > 0) {
                const formData = new FormData();
                stagedFiles.forEach(file => {
                    formData.append('file', file);
                });

                formData.append('forumId', currentForumId);
                formData.append('userId', user.id);

                if (messageText !== '') {
                    formData.append('messageText', messageText);
                }

                showNotification('Đang tải lên tệp...');
                const response = await apiService.fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                
                if (!response.success) {
                    throw new Error(response.message || 'Lỗi tải tệp.');
                }
                
                showNotification('Tải tệp lên thành công!');

            } else if (messageText !== '') {
                socket.emit('sendMessage', {
                    forumId: currentForumId,
                    userId: user.id,
                    messageText: messageText
                });
            }

        } catch (error) {
            console.error('Lỗi khi gửi:', error);
            alert("Gửi thất bại: " + error.message);
        } finally {
            messageInput.value = '';
            stagedFiles = [];
            updateStagingArea();
            messageInput.style.height = 'auto';
            messageInput.focus();
            sendBtn.disabled = true;
        }
    }
    
    async function selectForum(id, forumName) {
        if (id === currentForumId) return;

        if (socket && currentForumId) {
            socket.emit('leaveForum', { forumId: currentForumId });
        }

        currentForumId = id;
        chatHeaderTitle.textContent = forumName;

        messagesArea.innerHTML = '<div class="loader"></div>';
        memberListContainer.innerHTML = '<div class="loader"></div>';

        if (socket) {
            socket.emit('joinRoom', { forumId: currentForumId });
        }

        try {
            const [messagesRes, membersRes] = await Promise.all([
                apiService.fetch(`/api/forums/${currentForumId}/messages`),
                apiService.fetch(`/api/forums/${currentForumId}/members`)
            ]);
            if (messagesRes.success) renderMessages(messagesRes.data);
            if (membersRes.success) renderMembers(membersRes.data);
            
        } catch (error) {
            console.error(`Lỗi khi tải dữ liệu cho forum ${currentForumId}:`, error);
            messagesArea.innerHTML = `<p style="color: red; text-align: center;">${error.message}</p>`;
        }
    }
    
    function renderMembers(members) {
        if (!memberListContainer) return;
        memberListContainer.innerHTML = '';
        members.forEach(member => {
            const memberItem = document.createElement('div');
            memberItem.className = 'member-item';
            memberItem.innerHTML = `
                <div class="member-avatar">
                    <img src="${
                      member.avatar || "/templates/static/images/khongbiet.jpg"
                    }" alt="avatar" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <div class="member-info">
                    <div class="member-name">${member.Name}</div>
                    
                </div>
            `;
            memberListContainer.appendChild(memberItem);
        });
    }

    function rendererFormList(forums) {
        if (!groupList) return;
        groupList.innerHTML = ''; // Xóa nội dung cũ
        forums.forEach(forum => {
            const forumItem = document.createElement('div');
            forumItem.className = 'group-item';
            forumItem.innerHTML = `
                <div class="group-item-avatar"><i class="fas fa-users"></i></div>
                <div class="group-item-info">
                    <div class="group-item-name">${forum.name}</div>
                    <div class="group-item-lastmsg">Topic: ${forum.topic || 'Chưa có chủ đề'}</div>
                </div> `;

            forumItem.addEventListener('click', () => {
                document.querySelectorAll('.group-item').forEach(item => item.classList.remove('active'));
                forumItem.classList.add('active');
                selectForum(forum.id, forum.name);
            });
            groupList.appendChild(forumItem);
        });
    }

    async function loadUserForums() {
        try {
            const response = await apiService.fetch('/api/forums');
            if (response.success){
                rendererFormList(response.data);
                if (response.data.length > 0) {
                    const firstForum = response.data[0];
                    document.querySelector('.group-item').classList.add('active');
                    selectForum(firstForum.id, firstForum.name);
                } else {
                    chatHeaderTitle.textContent = "Chưa có diễn đàn";
                    messagesArea.innerHTML = '<p style="text-align: center;">Hãy tạo hoặc tham gia một diễn đàn để bắt đầu.</p>';
                }
            }  
        }catch (error) {
            console.error('Lỗi khi tải danh sách forum:', error);
            overlay.innerHTML = `<p style="color: red;">${error.message}. Bạn sẽ được chuyển hướng về trang đăng nhập.</p>`;
            overlay.style.display = 'flex';
            setTimeout(() => {
                apiService.logout();
            }, 3000);
        }           
    } 

    function scrollToBottom() {
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification show';
        notification.innerHTML = `<i class="fas fa-info-circle"></i> <span>${message}</span>`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    const showCreateGroupModalBtn = document.getElementById('showCreateGroupModalBtn');
    const createGroupModal = document.getElementById('createGroupModal');
    const closeCreateGroupModalBtn = document.getElementById('closeCreateGroupModal');
    const createGroupForm = document.getElementById('createGroupForm');

    if (showCreateGroupModalBtn) {
        showCreateGroupModalBtn.addEventListener('click', () => {
            if (createGroupModal) createGroupModal.style.display = 'flex';
        });
    }
    if (closeCreateGroupModalBtn) {
        closeCreateGroupModalBtn.addEventListener('click', () => {
            if (createGroupModal) createGroupModal.style.display = 'none';
        });
    }
    window.addEventListener('click', (event) => {
        if (event.target === createGroupModal) createGroupModal.style.display = 'none';
    });
    if (createGroupForm) {
        createGroupForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 
            const groupNameInput = document.getElementById('groupName');
            const groupTopicInput = document.getElementById('groupTopic');
            const groupData = {
                name: groupNameInput.value.trim(),
                topic: groupTopicInput.value.trim(),
            };
            if (!groupData.name) {
                alert('Vui lòng nhập tên nhóm.');
                return;
            }
            try {
                const response = await apiService.fetch('/api/forums', {
                    method: 'POST',
                    body: JSON.stringify(groupData)
                });
                alert(`Tạo nhóm "${response.data.name}" thành công!`);
                createGroupModal.style.display = 'none';
                createGroupForm.reset();
                loadUserForums();
            } catch (error) {
                console.error('Lỗi khi tạo nhóm:', error);
                alert(error.message || 'Đã có lỗi xảy ra khi tạo nhóm.');
            }
        });
    }

    // ================= SỰ KIỆN & HÀM MAIN ================
    
    sendBtn.addEventListener('click', executeSend);
    
    // MỚI: Gán sự kiện cho các nút và input file
    imageBtn.addEventListener('click', () => imageInput.click());
    fileBtn.addEventListener('click', () => fileInput.click());
    imageInput.addEventListener('change', handleFileSelection);
    fileInput.addEventListener('change', handleFileSelection);

    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            executeSend();
        }
    });
    
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        sendBtn.disabled = this.value.trim() === '' && stagedFiles.length === 0;
    });
    // ======================== CONTEXT MENU CHO TIN NHẮN ========================
    const messageContextMenu = document.getElementById('messageContextMenu');
    const downloadContextBtn = messageContextMenu.querySelector('.context-item'); // Giả sử nút tải về là nút đầu tiên

    let currentContextMenuTarget = null; // Lưu trữ tin nhắn đang được click chuột phải

    // Hàm ẩn context menu
    function hideContextMenu() {
        if (messageContextMenu) {
            messageContextMenu.classList.remove('show');
        }
        currentContextMenuTarget = null;
    }

    // Lắng nghe sự kiện click chuột phải trên vùng tin nhắn
    messagesArea.addEventListener('contextmenu', (event) => {
        // Chỉ hoạt động trên các tin nhắn là file
        const targetFileMessage = event.target.closest('.file-message');
        if (!targetFileMessage) {
            return;
        }

        event.preventDefault(); // Ngăn menu mặc định của trình duyệt
        currentContextMenuTarget = targetFileMessage;

        // Hiển thị menu tại vị trí con trỏ
        messageContextMenu.style.top = `${event.clientY}px`;
        messageContextMenu.style.left = `${event.clientX}px`;
        messageContextMenu.classList.add('show');
    });

    // Lắng nghe sự kiện click trên nút "Tải về" của context menu
    downloadContextBtn.addEventListener('click', () => {
        if (!currentContextMenuTarget) return;

        const filePath = currentContextMenuTarget.getAttribute('data-file-path');
        const fileName = currentContextMenuTarget.getAttribute('data-file-name');

        if (filePath && fileName) {
            // Tạo một thẻ <a> ẩn để kích hoạt việc tải xuống
            const downloadLink = document.createElement('a');
            downloadLink.href = `${API_CONFIG.getApiUrl()}/uploads/${filePath.split(/[\\/]/).pop()}`;
            downloadLink.download = fileName; // Thuộc tính này yêu cầu trình duyệt tải file về
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
        
        hideContextMenu(); // Ẩn menu sau khi click
    });

// Lắng nghe sự kiện click toàn cục để ẩn menu khi click ra ngoài
window.addEventListener('click', hideContextMenu);


initializeSocket();
loadUserForums();
})();
