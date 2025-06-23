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
  const userIcon = document.getElementById("user-avatar-icon");
  const defaultIcon = document.getElementById("default-user-icon");
  const userMenu = document.getElementById("userMenu");

  if (token && user && user.avatar) {
    // Có đăng nhập
    userIcon.src = user.avatar;
    userIcon.classList.remove("hidden");
    defaultIcon.classList.add("hidden");
  } else {
    // Chưa đăng nhập
    userIcon.classList.add("hidden");
    defaultIcon.classList.remove("hidden");
  }

  // Click avatar → toggle menu nếu đã login
  if (userIcon) {
    userIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isLoggedIn()) {
        userMenu.classList.toggle("hidden");
      }
    });
  }

  // Click icon user → chuyển đến login
  if (defaultIcon) {
    defaultIcon.addEventListener("click", () => {
      if (!isLoggedIn()) {
        window.location.href = "/login.html";
      }
    });
  }

  // Ẩn menu khi click ra ngoài
  document.addEventListener("click", (e) => {
    if (userMenu && !userMenu.contains(e.target) && e.target !== userIcon) {
      userMenu.classList.add("hidden");
    }
  });
}

function isLoggedIn() {
  return localStorage.getItem("accessToken") !== null;
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user"); 
  window.location.href = "login.html";
}

window.addEventListener('storage', function(e) {
  if (e.key === 'user') {
    initSidebar();
  }
});