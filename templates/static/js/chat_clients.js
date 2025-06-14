 // DOM Elements
            const darkModeToggle = document.getElementById('darkModeToggle');
            const toggleGroupsSidebar = document.getElementById('toggleGroupsSidebar');
            const groupsSidebar = document.getElementById('groupsSidebar');
            const toggleInfoSidebar = document.getElementById('toggleInfoSidebar');
            const infoSidebar = document.getElementById('infoSidebar');
            const messageInput = document.getElementById('messageInput');
            const sendBtn = document.getElementById('sendBtn');
            const messagesArea = document.getElementById('messagesArea');
            const emojiBtn = document.getElementById('emojiBtn');
            const imageBtn = document.getElementById('imageBtn');
            const fileBtn = document.getElementById('fileBtn');
            const imageInput = document.getElementById('imageInput');
            const fileInput = document.getElementById('fileInput');
            const messageContextMenu = document.getElementById('messageContextMenu');
            const muteBtn = document.getElementById('muteBtn');
            const muteContextMenu = document.getElementById('muteContextMenu');
            const imageModal = document.getElementById('imageModal');
            const modalImage = document.getElementById('modalImage');
            const modalClose = document.getElementById('modalClose');
            const filterTabs = document.querySelectorAll('.filter-tab');

            // Theme management
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