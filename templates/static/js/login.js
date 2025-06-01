//animation cho phần đăng nhập/ đăng kíkí
const container = document.querySelector(".container");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

//xử lý đăng nhập
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = "index.html"; // Đổi sang trang chính
      } else {
        alert(data.message || "Sai tên đăng nhập hoặc mật khẩu!");
      }
    } catch (err) {
      alert("Lỗi đăng nhập: " + err.message);
    }
  });
});
