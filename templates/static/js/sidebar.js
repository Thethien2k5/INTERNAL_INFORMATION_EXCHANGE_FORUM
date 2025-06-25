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
}

function isLoggedIn() {
  return localStorage.getItem("accessToken") !== null;
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

window.addEventListener("storage", function (e) {
  if (e.key === "user") {
    initSidebar();
  }
});
