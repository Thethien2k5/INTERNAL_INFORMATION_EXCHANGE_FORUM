function initSidebar() {
  const themeToggle = document.querySelector(".theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  if (!themeToggle || !themeIcon) return;

  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener("click", function () {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (theme === "dark") {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    } else {
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
    }
  }

  // Avatar login
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("accessToken");
  const defaultIcon = document.getElementById("default-user-icon");
  const avatarImg = document.getElementById("user-avatar");
  const userMenu = document.getElementById("userMenu");

  const isImformationPage = window.location.pathname.includes("imformation");

  if (isImformationPage) {
    // Nếu đang ở trang imformation.html → ẩn cả avatar và icon
    if (defaultIcon) defaultIcon.style.display = "none";
    if (avatarImg) avatarImg.style.display = "none";
  } else if (token && user && user.avatar) {
    // Đã đăng nhập, có avatar → hiện avatar, ẩn icon
    if (defaultIcon) defaultIcon.style.display = "none";
    if (avatarImg) {
      avatarImg.src = "/uploads/" + user.avatar;
      avatarImg.style.display = "block";
    }
  } else {
    // Chưa đăng nhập hoặc không có avatar → hiện icon, ẩn avatar
    if (defaultIcon) defaultIcon.style.display = "block";
    if (avatarImg) avatarImg.style.display = "none";
  }

 

  // Click icon → toggle menu nếu đã login
  const toggleTarget = token && user ? avatarImg : defaultIcon;
  if (toggleTarget) {
    toggleTarget.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isLoggedIn()) {
        userMenu.classList.toggle("hidden");
      } else {
        window.location.href = "/login.html";
      }
    });
  }

  // Ẩn menu khi click ra ngoài
  document.addEventListener("click", (e) => {
    if (userMenu && !userMenu.contains(e.target) && e.target !== toggleTarget) {
      userMenu.classList.add("hidden");
    }
  });

  // Tự động ẩn sidebar khi click ra ngoài
document.addEventListener("click", function (e) {
  const sidebar = document.getElementById("slidebar");
  const menuToggleCheckbox = document.getElementById("menu-toggle");

  if (
    sidebar &&
    menuToggleCheckbox &&
    !sidebar.contains(e.target) &&
    menuToggleCheckbox.checked
  ) {
    menuToggleCheckbox.checked = false;
  }
});

// Tự động ẩn sidebar khi click vào các mục menu điều hướng
const navLinks = document.querySelectorAll(".menu_item a");
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    const menuToggleCheckbox = document.getElementById("menu-toggle");
    if (menuToggleCheckbox) {
      menuToggleCheckbox.checked = false;
    }
  });
});

}

function isLoggedIn() {
  return localStorage.getItem("accessToken") !== null;
}

function logout() {
  // Xóa thông tin đăng nhập
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');

  // Ẩn các overlay có thể còn sót lại từ trang chat để tránh lỗi hiển thị
  const chatOverlay = document.getElementById('auth-overlay');
  if (chatOverlay) {
    chatOverlay.style.display = 'none';
  }
  
  const loginLoader = document.getElementById('loadingOverlay');
  if (loginLoader) {
      loginLoader.style.display = 'none';
  }

  // Gọi hàm loadContent của SPA để chuyển trang một cách "sạch sẽ"
  // Hàm loadContent đã được định nghĩa toàn cục trong index.html
  if (window.loadContent) {
    window.loadContent('login'); 
  } else {
    // Nếu có lỗi, dùng cách điều hướng truyền thống để đảm bảo vẫn đăng xuất được
    window.location.href = '/login';
  }
}

window.addEventListener("storage", function (e) {
  if (e.key === "user") {
    initSidebar();
  }
});
