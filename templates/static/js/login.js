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
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const messageDiv = document.getElementById("message");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = form.username.value.trim();
    const password = form.password.value.trim();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      if (result.success) {
        messageDiv.textContent = "Đăng nhập thành công!";
        messageDiv.style.color = "green";
        // Ví dụ chuyển hướng:
        // window.location.href = "/dashboard";
      } else {
        messageDiv.textContent = result.message || "Sai tài khoản hoặc mật khẩu.";
        messageDiv.style.color = "red";
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu đăng nhập:", error);
      messageDiv.textContent = "Lỗi máy chủ.";
      messageDiv.style.color = "red";
    }
  });
});
