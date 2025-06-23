const socketIoScript = document.createElement("script");
socketIoScript.src = `${API_CONFIG.getApiUrl()}/socket.io/socket.io.js`;
document.head.appendChild(socketIoScript);

function initializeApp() {
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
            window.location.href = '/login.html';
        }, 3500);
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
            const downloadPath = `${API_CONFIG.getApiUrl()}/uploads/${msg.file_path.split(/[\\/]/).pop()}`;
            const fileSize = msg.file_size ? (msg.file_size / 1024 / 1024).toFixed(2) + ' MB' : '';
            messageBubbleContent = `
                <a href="${downloadPath}" target="_blank" download="${msg.file_name}" class="message-bubble file-message" style="text-decoration: none; color: inherit;">
                    <div class="file-icon"><i class="fas fa-file-download"></i></div>
                    <div class="file-info">
                        <div class="file-name">${msg.file_name || 'Tập tin'}</div>
                        <div class="file-size">${fileSize}</div>
                    </div>
                </a>`;
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
        imageInput.value = ''; // Cũng reset cả input ảnh
    }

    async function executeSend() {
        const messageText = messageInput.value.trim();
        
        if (messageText === '' && stagedFiles.length === 0) return;
        
        sendBtn.disabled = true;

        try {
            if (stagedFiles.length > 0) {
                const formData = new FormData();
                stagedFiles.forEach(file => {
                    formData.append('files', file);
                });

                formData.append('forumId', currentForumId);
                
                if (messageText !== '') {
                    formData.append('messageText', messageText);
                }

                showNotification('Đang tải lên tệp...');
                const response = await apiService.fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': null // Để trình duyệt tự đặt Content-Type cho FormData
                    }
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












/*
    // -------------------Điều chỉnh theme tối/sáng--------------------
    let isDarkMode = localStorage.getItem('darkMode') === 'true';
    updateTheme();

    function updateTheme() {
        document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        const icon = darkModeToggle.querySelector('i');
        if (isDarkMode) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            darkModeToggle.title = "Chế độ sáng";
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            darkModeToggle.title = "Chế độ tối";
        }
    }

    darkModeToggle.addEventListener('click', function() {
        isDarkMode = !isDarkMode;
        localStorage.setItem('darkMode', isDarkMode);
        updateTheme();
    });

    // File filter tabs
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter files
            const allFiles = document.querySelectorAll('.shared-file-item');
            if (type === 'all') {
                allFiles.forEach(file => file.style.display = 'block');
            } else {
                allFiles.forEach(file => {
                    if (file.getAttribute('data-type') === type) {
                        file.style.display = 'block';
                    } else {
                        file.style.display = 'none';
                    }
                });
            }
        });
    });

    // Sidebar toggle
    toggleGroupsSidebar.addEventListener('click', () => {
        if (window.innerWidth <= 1200) {
            groupsSidebar.classList.toggle('show');
        }
    });

    toggleInfoSidebar.addEventListener('click', () => {
        infoSidebar.classList.toggle('show');
    });

    // Message input auto-resize
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        sendBtn.disabled = !this.value.trim();
    });

    // Send message on Enter (without Shift)
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Send button click
    sendBtn.addEventListener('click', sendMessage);

    function sendMessage() {
        const text = messageInput.value.trim();
        if (!text) return;

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message sent';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-sender">Bạn</span>
                    <span class="message-time">${formatTime(new Date())}</span>
                </div>
                <div class="message-bubble">
                    ${text}
                </div>
                <div class="message-actions">
                    <button class="message-action" title="Trả lời">
                        <i class="fas fa-reply"></i>
                    </button>
                    <button class="message-action" title="Chia sẻ">
                        <i class="fas fa-share"></i>
                    </button>
                    <button class="message-action" title="Tùy chọn" onclick="showMessageContextMenu(event)">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
        `;

        // Add to chat area
        messagesArea.appendChild(messageDiv);
        
        // Clear input and reset
        messageInput.value = '';
        messageInput.style.height = 'auto';
        sendBtn.disabled = true;
        scrollToBottom();
    }

    function formatTime(date) {
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }

    function scrollToBottom() {
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    // File upload handlers
    imageBtn.addEventListener('click', () => imageInput.click());
    fileBtn.addEventListener('click', () => fileInput.click());

    imageInput.addEventListener('change', handleImageUpload);
    fileInput.addEventListener('change', handleFileUpload);

    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                addImageMessage(e.target.result, file.name);
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    }

    function handleFileUpload(e) {
        const file = e.target.files[0];
        if (file) {
            addFileMessage(file);
        }
        e.target.value = '';
    }

    function addImageMessage(src, name) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message sent';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-sender">Bạn</span>
                    <span class="message-time">${formatTime(new Date())}</span>
                </div>
                <div class="message-bubble image-message">
                    <img src="${src}" alt="${name}" onclick="showImageModal('${src}')">
                </div>
                <div class="message-actions">
                    <button class="message-action" title="Trả lời">
                        <i class="fas fa-reply"></i>
                    </button>
                    <button class="message-action" title="Chia sẻ">
                        <i class="fas fa-share"></i>
                    </button>
                    <button class="message-action" title="Tùy chọn" onclick="showMessageContextMenu(event)">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
        `;

        messagesArea.appendChild(messageDiv);
        scrollToBottom();
    }

    function addFileMessage(file) {
        const fileIcon = getFileIcon(file.type);
        const fileSize = formatFileSize(file.size);
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message sent';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-sender">Bạn</span>
                    <span class="message-time">${formatTime(new Date())}</span>
                </div>
                <div class="message-bubble file-message">
                    <div class="file-icon">
                        <i class="${fileIcon}"></i>
                    </div>
                    <div class="file-info">
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${fileSize}</div>
                    </div>
                </div>
                <div class="message-actions">
                    <button class="message-action" title="Trả lời">
                        <i class="fas fa-reply"></i>
                    </button>
                    <button class="message-action" title="Chia sẻ">
                        <i class="fas fa-share"></i>
                    </button>
                    <button class="message-action" title="Tùy chọn" onclick="showMessageContextMenu(event)">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
        `;

        messagesArea.appendChild(messageDiv);
        scrollToBottom();
    }

    function getFileIcon(mimeType) {
        if (mimeType.includes('pdf')) return 'fas fa-file-pdf';
        if (mimeType.includes('word')) return 'fas fa-file-word';
        if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'fas fa-file-excel';
        if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'fas fa-file-powerpoint';
        if (mimeType.includes('zip') || mimeType.includes('rar')) return 'fas fa-file-archive';
        if (mimeType.includes('video')) return 'fas fa-file-video';
        if (mimeType.includes('audio')) return 'fas fa-file-audio';
        if (mimeType.includes('image')) return 'fas fa-file-image';
        return 'fas fa-file-alt';
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i]);
    }

    // Context menu
    function showMessageContextMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        
        messageContextMenu.style.left = e.pageX + 'px';
        messageContextMenu.style.top = e.pageY + 'px';
        messageContextMenu.classList.add('show');
        
        // Adjust position if near window edges
        const rect = messageContextMenu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            messageContextMenu.style.left = (e.pageX - (rect.right - window.innerWidth)) + 'px';
        }
        if (rect.bottom > window.innerHeight) {
            messageContextMenu.style.top = (e.pageY - (rect.bottom - window.innerHeight)) + 'px';
        }
    }

    // Hiển thị menu im lặng
    muteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const rect = this.getBoundingClientRect();
        muteContextMenu.style.left = `${rect.left}px`;
        muteContextMenu.style.top = `${rect.bottom + 5}px`;
        muteContextMenu.classList.add('show');
    });

    // Xử lý lựa chọn thời gian im lặng
    document.querySelectorAll('#muteContextMenu .context-item').forEach(item => {
        item.addEventListener('click', function() {
            const time = this.getAttribute('data-time');
            if (time === 'custom') {
                alert('Mở cài đặt tùy chỉnh');
            } else {
                showNotification(`Đã tắt thông báo trong ${time} giờ`);
            }
            muteContextMenu.classList.remove('show');
        });
    });

    // Context menu không đóng khi click bên trong
    document.querySelectorAll('.context-menu').forEach(menu => {
        menu.addEventListener('click', e => e.stopPropagation());
    });

    // Đóng context menu khi click bất kỳ đâu
    document.addEventListener('click', function() {
        document.querySelectorAll('.context-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    });

    // Image modal
    function showImageModal(src) {
        modalImage.src = src;
        imageModal.classList.add('show');
    }

    modalClose.addEventListener('click', () => {
        imageModal.classList.remove('show');
    });

    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            imageModal.classList.remove('show');
        }
    });

    // Hiển thị thông báo
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification show';
        notification.innerHTML = `
            <i class="fas fa-bell-slash"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Mở ảnh chia sẻ trong modal
    document.querySelectorAll('.shared-file-item[data-type="image"] img').forEach(img => {
        img.addEventListener('click', function() {
            showImageModal(this.src);
        });
    });

    // Make functions available globally for inline handlers
    window.showImageModal = showImageModal;
    window.showMessageContextMenu = showMessageContextMenu;

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        // Scroll to bottom initially
        scrollToBottom();
        
        // Show initial messages with delay
        document.querySelectorAll('.message').forEach((msg, i) => {
            msg.style.animationDelay = `${i * 0.1}s`;
        });
    });
*/

  // ======================== HÀM MAIN ========================
  function main() {
    // Khởi tạo Socket.IO
    initializeSocket();
    // Tải danh sách diễn đàn
    loadUserForums();
  }
  main();
}

socketIoScript.onload = () => {
  initializeApp();
};
