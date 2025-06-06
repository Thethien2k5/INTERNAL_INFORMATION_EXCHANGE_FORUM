function openModal() {
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// Tự đóng modal khi click ra ngoài nội dung
window.onclick = function (event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Hàm gán sự kiện like cho nút like
function addLikeEvent(likeBtn) {
  likeBtn.addEventListener("click", function () {
    const icon = this.querySelector("i");
    this.classList.toggle("liked");
    if (icon.classList.contains("fa-regular")) {
      icon.classList.remove("fa-regular");
      icon.classList.add("fa-solid");
    } else {
      icon.classList.remove("fa-solid");
      icon.classList.add("fa-regular");
    }
  });
}

// Hàm tạo HTML bài viết từ object bài viết
function createPostHTML(post) {
  return `
    <div class="post-card" data-id="${post.id}">
      <div class="post-header" style="display:flex; align-items:center; gap:10px;">
        <span class="avatar">
          <img src="${post.avatar}" alt="avatar" style="width:40px; height:40px; border-radius:50%;" />
        </span>
        <a href="profile.html?user=${encodeURIComponent(post.name)}" class="user-link" style="text-decoration:none; font-weight:bold; color:#333;">
          ${post.name}
        </a>
        <button class="delete-btn" title="Xóa bài" style="margin-left:auto; background:none; border:none; cursor:pointer; font-size:24px; color:#888;">&times;</button>
      </div>
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <div class="actions">
        <button class="icon-btn like-btn ${post.liked ? 'liked' : ''}">
          <i class="${post.liked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </button>
        <button class="icon-btn share-btn">
          <i class="fa-solid fa-share"></i>
        </button>
      </div>
    </div>
  `;
}

// Lấy danh sách bài viết từ localStorage (trả về mảng bài hoặc [] nếu chưa có)
function getPostsFromStorage() {
  const posts = localStorage.getItem('posts');
  return posts ? JSON.parse(posts) : [];
}

// Lưu danh sách bài viết vào localStorage
function savePostsToStorage(posts) {
  localStorage.setItem('posts', JSON.stringify(posts));
}

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const postsContainer = document.getElementById("posts-container");
  const submitBtn = document.querySelector("#modal .submit");
  const titleInput = document.querySelector("#modal input[placeholder='Chủ đề']");
  const contentInput = document.querySelector("#modal textarea[placeholder='Mô tả...']");

  if (!user || !postsContainer || !submitBtn || !titleInput || !contentInput) {
    console.warn("Thiếu phần tử hoặc user chưa đăng nhập");
    return;
  }

  // Load bài viết từ storage ra UI
  let posts = getPostsFromStorage();
  postsContainer.innerHTML = posts.map(createPostHTML).join('');

  // Gán sự kiện like và xóa cho các bài viết load lên
  postsContainer.querySelectorAll(".post-card").forEach(postCard => {
    const likeBtn = postCard.querySelector(".like-btn");
    const deleteBtn = postCard.querySelector(".delete-btn");
    const postId = postCard.getAttribute("data-id");

    addLikeEvent(likeBtn);

    deleteBtn.addEventListener("click", () => {
      if (confirm("Bạn có chắc muốn xóa bài viết này?")) {
        // Xóa UI
        postCard.remove();
        // Xóa khỏi storage
        posts = posts.filter(p => p.id !== postId);
        savePostsToStorage(posts);
      }
    });

    // Thêm sự kiện toggle like lưu trạng thái vào storage
    likeBtn.addEventListener("click", () => {
      posts = posts.map(p => {
        if (p.id === postId) {
          p.liked = !p.liked;
        }
        return p;
      });
      savePostsToStorage(posts);
    });
  });

  // Đăng bài mới
  submitBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
      alert("Vui lòng nhập tiêu đề và nội dung bài viết");
      return;
    }

    // Tạo object bài viết mới
    const newPost = {
      id: Date.now().toString(), // id duy nhất theo timestamp
      avatar: user.avatar,
      name: user.name,
      title,
      content,
      liked: false
    };

    // Thêm vào mảng posts và lưu
    posts.unshift(newPost);
    savePostsToStorage(posts);

    // Thêm vào UI
    const postHTML = createPostHTML(newPost);
    postsContainer.insertAdjacentHTML("afterbegin", postHTML);

    // Lấy bài viết vừa tạo và gán sự kiện
    const newPostCard = postsContainer.querySelector(".post-card:first-child");
    const newLikeBtn = newPostCard.querySelector(".like-btn");
    const deleteBtn = newPostCard.querySelector(".delete-btn");

    addLikeEvent(newLikeBtn);

    deleteBtn.addEventListener("click", () => {
      if (confirm("Bạn có chắc muốn xóa bài viết này?")) {
        newPostCard.remove();
        posts = posts.filter(p => p.id !== newPost.id);
        savePostsToStorage(posts);
      }
    });

    newLikeBtn.addEventListener("click", () => {
      posts = posts.map(p => {
        if (p.id === newPost.id) {
          p.liked = !p.liked;
        }
        return p;
      });
      savePostsToStorage(posts);
    });

    // Đóng modal và reset form
    closeModal();
    titleInput.value = "";
    contentInput.value = "";
  });
});
