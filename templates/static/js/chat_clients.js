const socketIoScript = document.createElement("script");
socketIoScript.src = `${API_CONFIG.getApiUrl()}/socket.io/socket.io.js`;
document.head.appendChild(socketIoScript);

function initializeApp() {
  // ---------------------------------DOM Elements--------------------------------

  // const darkModeToggle = document.getElementById('darkModeToggle');
  // const toggleGroupsSidebar = document.getElementById('toggleGroupsSidebar');
  // const groupsSidebar = document.getElementById('groupsSidebar');
  // const toggleInfoSidebar = document.getElementById('toggleInfoSidebar');
  // const infoSidebar = document.getElementById('infoSidebar');
  // const messageInput = document.getElementById('messageInput');
  const sendBtn = document.getElementById("sendBtn");
  //
  // const emojiBtn = document.getElementById('emojiBtn');
  const imageBtn = document.getElementById("imageBtn");
  const fileBtn = document.getElementById("fileBtn");
  // const imageInput = document.getElementById('imageInput');
  const fileInput = document.getElementById("fileInput");
  // const messageContextMenu = document.getElementById('messageContextMenu');
  // const muteBtn = document.getElementById('muteBtn');
  // const muteContextMenu = document.getElementById('muteContextMenu');
  // const imageModal = document.getElementById('imageModal');
  // const modalImage = document.getElementById('modalImage');
  // const modalClose = document.getElementById('modalClose');
  // const filterTabs = document.querySelectorAll('.filter-tab');
  const messageInput = document.getElementById("messageInput");

  const messagesArea = document.getElementById("messagesArea"); // Khu vực hiển thị tin nhắn
  const memberListContainer = document.getElementById("member-list"); // Thêm ID này vào HTML

  // Lớp làm mờ khi không có quyền truy cập
  const overlay = document.getElementById("auth-overlay");

  // Lớp danh sách nhóm
  const groupList = document.getElementById("groupList");

  // Tiêu đề của chat header
  const chatHeaderTitle = document.querySelector(".chat-title h2");

  // Kiểm tra xem người dùng đã đăng nhập chưa
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  let forumId = null;
  let socket; // Khởi tạo Socket.IO client
  // ======================== XÁC THỰC NGƯỜI DÙNG ========================
  if (!user || !localStorage.getItem("accessToken")) {
    if (overlay) {
      // Hiển thị lớp phủ
      overlay.style.display = "flex";
      setTimeout(() => overlay.classList.add("show"), 10); // Thêm hiệu ứng fade-in
    }
    setTimeout(() => {
      window.location.href = "/login.html";
    }, 3500); // Trả về trang đăng nhập của bạn
    return;
  }

  // ======================== KHỞI TẠO SOCKET.IO ========================
  function initializeSocket() {
    socket = io(API_CONFIG.getApiUrl(), {
      auth: {
        token: localStorage.getItem("accessToken"), // Gửi token khi kết nối
      },
    });
    socket.on("connect", () => {
      console.log("Kết nối thành công với Socket.IO", socket.id);
    });

    socket.on("newMessage", (message) => {
      // Kiểm tra xem message có forumId trùng với forumId hiện tại không
      if (message.forum_id === forumId) {
        renderSingleMessage(message);
        scrollToBottom();
      }
    });
  }
  // ======================== TIN NHẮN VÀ FILE ===================================
  // --------------------- Render từng tin nhắn + file đã gửi --------------------------
  function renderSingleMessage(msg) {
    const messageDiv = document.createElement("div");
    const isSentByMe = msg.user_id === user.id;
    messageDiv.className = `message ${isSentByMe ? "sent" : "received"}`;

    // Định dạng thời gian
    const messageTime = new Date(msg.created_at).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }); // định dạng thời gian bằng 2 chữ số

    let messageBubbleContent = "";
    if (msg.content_type === "text") {
      messageBubbleContent = `<div class="message-bubble">${msg.content_text}</div>`;
    } else {
      // Xử lý cho file sẽ được thêm ở Giai đoạn 3
      const downloadPath = `${API_CONFIG.getApiUrl()}/uploads/${msg.file_path
        .split(/[\\/]/)
        .pop()}`;

      messageBubbleContent = `
                <a href="${downloadPath}" target="_blank" download="${
        msg.file_name
      }" class="message-bubble file-message" style="text-decoration: none; color: inherit;">
                    <div class="file-icon"><i class="fas fa-download"></i></div>
                    <div class="file-info">
                        <div class="file-name">${
                          msg.file_name || "Tập tin"
                        }</div>
                        <div class="file-size">${
                          msg.file_size
                            ? (msg.file_size / 1024).toFixed(2) + " KB"
                            : ""
                        }</div>
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

  // --------------------- Render danh sách tin nhắn + file đã gửi ----------------------
  function renderMessages(messages) {
    messagesArea.innerHTML = ""; // Xóa tin nhắn cũ
    if (messages.length === 0) {
      messagesArea.innerHTML =
        '<p style="text-align: center; color: #888;">Nhắn gì đó như "Xin chào các bạn !!"</p>';
      return;
    }
    messages.forEach((msg) => renderSingleMessage(msg));
    scrollToBottom();
  }

  // ! ---------------------Hàm xữ lý tin nhắn-----------------------------
  function handSendMessage() {
    const messageText = messageInput.value.trim();
    // Đảm bảo user và forumId tồn tại
    if (messageText && user && user.id && forumId && socket) {
      // 1. Tạo đối tượng tin nhắn tạm thời để hiển thị ngay
      const localMessage = {
        content_type: "text",
        content_text: messageText,
        created_at: new Date().toISOString(),
        user_id: user.id,
        username: user.username, // Lấy username từ đối tượng user đã đăng nhập
        avatar: user.avatar, // Lấy avatar từ đối tượng user đã đăng nhập
      };

      // 2. Render tin nhắn này ngay lập tức trên màn hình người gửi
      renderSingleMessage(localMessage);
      scrollToBottom();

      // 3. Dữ liệu để gửi lên server không thay đổi
      const messageData = {
        forumId: forumId,
        userId: user.id,
        messageText: messageText,
      };

      // 4. Gửi sự kiện 'sendMessage' lên server
      socket.emit("sendMessage", messageData);

      // 5. Xóa input và reset
      messageInput.value = "";
      messageInput.focus();
      messageInput.style.height = "auto";
      sendBtn.disabled = true;
    }
  }

  // ! ---------------------Hàm xữ lý file----------------------------------
  async function handSendFile(event) {
    const files = event.target.files;
    if (file.length === 0 || !forumId) {
      return;
    }

    const formData = new FormData(); //này là đổi tượng của web trình duyện có mục đích làm vật chứa
    for (const file of files) {
      formData.append("files", file);
    }

    formData.append("forumId", forumId);
    formData.append("userId", user.id);
    try {
      showNotification("Đang tải lên tệp...");
      const response = await fetch(API_CONFIG.getApiUrl() + "/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(result.message || "Lỗi tải tệp.");
      }
      console.log(
        "Tải tệp thành công, server sẽ thông báo cho các client.",
        result
      );
      showNotification("Tải tệp lên thành công!");
    } catch {
      console.error("Lỗi khi tải tệp: ", error);
      alert("Lỗi tải tệp nha" + error.message);
    } finally {
      // Reset input để có thể chọn lại cùng một file
      fileInput.value = "";
    }
  }

  // ============================== DANH SÁCH THÀNH VIÊN ========================
  function renderMembers(members) {
    if (!memberListContainer) return;
    memberListContainer.innerHTML = "";
    members.forEach((member) => {
      const memberItem = document.createElement("div");
      memberItem.className = "member-item";
      memberItem.innerHTML = `
                <div class="member-avatar">
                    <img src="${
                      member.avatar || "/templates/static/images/khongbiet.jpg"
                    }" alt="avatar" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <div class="member-info">
                    <div class="member-name">${member.username}</div>
                    
                </div>
            `;
      // <div class="member-status status-online">Đang hoạt động</div>
      memberListContainer.appendChild(memberItem);
    });
  }

  // ============================== NHÓM CHAT ==============================

  // -------- Hàm chọn nhóm và cập nhật tiêu đề chat header ----------
  async function selectForum(id, forumName) {
    if (id === forumId) return; // Nếu đã chọn nhóm này thì không làm gì cả

    // Rời phòng chat cũ nếu có
    if (socket && forumId) {
      socket.emit("leaveForum", { forumId: forumId });
    }

    // Cập nhật forumId mới
    forumId = id;
    chatHeaderTitle.textContent = forumName;

    // Tạo cái load tin nhắn xoay khi đợi lấy tin nhắn từ server
    messagesArea.innerHTML = '<div class="loader"></div>';
    memberListContainer.innerHTML = '<div class="loader"></div>';

    // Tham gia phòng chat mới
    if (socket) {
      socket.emit("joinRoom", { forumId: forumId });
    }

    try {
      // Lấy tin nhắn và thành viên của nhóm mới
      const [messagesRes, membersRes] = await Promise.all([
        apiService.fetch(`/api/forums/${forumId}/messages`),
        apiService.fetch(`/api/forums/${forumId}/members`),
      ]);
      // render ra tin nhắn
      if (messagesRes.success) renderMessages(messagesRes.data);
      if (membersRes.success) renderMembers(membersRes.data);
    } catch (error) {
      console.error(`Lỗi khi tải dữ liệu cho forum ${forumId}:`, error);
      messagesArea.innerHTML = `<p style="color: red; text-align: center;">${error.message}</p>`;
    }
  }

  // -------- Hàm render ra danh sách nhóm ----------
  function rendererFormList(forums) {
    if (!groupList) return;
    groupList.innerHTML = ""; // Xóa nội dung cũ
    forums.forEach((forum) => {
      // Tạo phần tử nhóm
      const forumItem = document.createElement("div");
      forumItem.className = "group-item";
      forumItem.innerHTML = `
                <div class="group-item-avatar"><i class="fas fa-users"></i></div>
                <div class="group-item-info">
                    <div class="group-item-name">${forum.name}</div>
                    <div class="group-item-lastmsg">${forum.topic}</div>
                </div> `;

      //Bắt sự kiện click khi chuyển nhóm khác
      forumItem.addEventListener("click", () => {
        // Xóa lớp active khỏi khỏi lớp group-item
        document
          .querySelectorAll(".group-item")
          .forEach((item) => item.classList.remove("active"));
        // Thêm lớp active vào nhóm đã chọn
        forumItem.classList.add("active");
        selectForum(forum.id, forum.name);
      });
      // Thêm phần tử nhóm vào danh sách
      groupList.appendChild(forumItem);
    });
  }

  // -------- Hàm lấy danh sách nhóm từ server ----------
  async function loadUserForums() {
    try {
      const response = await apiService.fetch("/api/forums");
      if (response.success) {
        rendererFormList(response.data);
        if (response.data.length > 0) {
          const firstForum = response.data[0];
          document.querySelector(".group-item").classList.add("active");
          selectForum(firstForum.id, firstForum.name);
        } else {
          // Xử lý khi không có forum nào
          chatHeaderTitle.textContent = "Chưa có diễn đàn";
          messagesArea.innerHTML =
            '<p style="text-align: center;">Hãy tạo hoặc tham gia một diễn đàn để bắt đầu.</p>';
        }
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách forum:", error);
      overlay.innerHTML = `<p style="color: red;">${error.message}. Bạn sẽ được chuyển hướng về trang đăng nhập.</p>`;
      overlay.style.display = "flex";
      setTimeout(() => {
        apiService.logout();
      }, 3000);
    }
  }

  // ================== TÍNH NĂNG KHÁC ===========================

  // Để lướt xuống thôi :)))
  function scrollToBottom() {
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  // ================= SỰ KIỆN KHI NHẤN NÚT GỬI TIN ================

  sendBtn.addEventListener("click", handSendMessage); // Bắt sự kiện khi nhắn nút gửi
  messageInput.addEventListener("keydown", (e) => {
    // Này là bắt sự kiện khi nhắn Enter để gửi tin
    fileBtn.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", handSendFile);
    if (e.key === "Enter" && !e.key === "shiftKey") {
      e.preventDefault(); // Ngăn không cho enter xuống dòng
      handSendMessage();
    }
  });
  // Này là để tùy chỉnh ô Input
  messageInput.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = Math.min(this.scrollHeight, 120) + "px";
    sendBtn.disabled = !this.value.trim();
  });

  function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification show";
    notification.innerHTML = `<i class="fas fa-info-circle"></i> <span>${message}</span>`;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Lấy các phần tử DOM cho chức năng tạo nhóm
  const showCreateGroupModalBtn = document.getElementById(
    "showCreateGroupModalBtn"
  );
  const createGroupModal = document.getElementById("createGroupModal");
  const closeCreateGroupModalBtn = document.getElementById(
    "closeCreateGroupModal"
  );
  const createGroupForm = document.getElementById("createGroupForm");

  // 1. Mở modal khi nhấn nút "Tạo nhóm mới"
  if (showCreateGroupModalBtn) {
    showCreateGroupModalBtn.addEventListener("click", () => {
      if (createGroupModal) {
        createGroupModal.classList.add("show"); // Dùng classList để thêm class 'show'
      }
    });
  }

  // 2. Đóng modal khi nhấn nút (x)
  if (closeCreateGroupModalBtn) {
    closeCreateGroupModalBtn.addEventListener("click", () => {
      if (createGroupModal) {
        createGroupModal.classList.remove("show"); // Dùng classList để xóa class 'show'
      }
    });
  }

  // Đóng modal khi người dùng nhấp ra ngoài khu vực modal
  window.addEventListener("click", (event) => {
    if (event.target === createGroupModal) {
      createGroupModal.classList.remove("show");
    }
  });

  // 3. Xử lý việc tạo nhóm khi submit form
  if (createGroupForm) {
    createGroupForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Ngăn form tự động reload lại trang

      const groupNameInput = document.getElementById("groupName");
      const groupTopicInput = document.getElementById("groupTopic");

      // Lấy dữ liệu từ form
      const groupData = {
        name: groupNameInput.value.trim(),
        topic: groupTopicInput.value.trim(),
      };

      // Kiểm tra dữ liệu đầu vào
      if (!groupData.name) {
        alert("Vui lòng nhập tên nhóm.");
        return;
      }

      try {
        // Giả định bạn có một hàm `createForum` trong apiService để gọi API
        const newGroup = await apiService.createForum(groupData);

        alert(`Tạo nhóm "${newGroup.name}" thành công!`);
        createGroupModal.classList.remove("show");
        groupNameInput.value = ""; // Xóa trắng form
        groupTopicInput.value = ""; // Xóa trắng form
        // Cân nhắc tải lại danh sách nhóm thay vì cả trang
        // Ví dụ: await loadForums();
        window.location.reload(); // Tải lại cả trang để cập nhật danh sách nhóm mới
      } catch (error) {
        console.error("Lỗi khi tạo nhóm:", error);
        // Giả định lỗi trả về có dạng { message: "..." }
        const errorMessage = error.responseJSON
          ? error.responseJSON.message
          : "Đã có lỗi xảy ra khi tạo nhóm.";
        alert(errorMessage);
      }
    });
  }

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
