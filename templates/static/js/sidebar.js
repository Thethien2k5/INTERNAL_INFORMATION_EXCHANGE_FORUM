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
  const userMenu = document.getElementById("userMenu");

  // Click icon → toggle menu nếu đã login
  if (defaultIcon) {
    defaultIcon.addEventListener("click", (e) => {
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
    if (userMenu && !userMenu.contains(e.target) && e.target !== defaultIcon) {
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

window.addEventListener('storage', function (e) {
  if (e.key === 'user') {
    initSidebar();
  }
});