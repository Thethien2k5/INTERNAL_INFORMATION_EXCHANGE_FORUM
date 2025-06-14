// animation cho phần đăng nhập/ đăng ký
const container = document.querySelector(".container");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// xử lý đăng nhập
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = loginForm.username.value.trim();
    const password = loginForm.password.value;
    const apiURL = API_CONFIG.getApiUrl();

    try {
      const res = await fetch(apiURL+"/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Lưu Access Token vào localStorage
        localStorage.setItem('accessToken', data.accessToken);

        // Dùng JSON.stringify để chuyển object thành chuỗi trước khi lưu
        localStorage.setItem('user', JSON.stringify(data.user));


        alert("Đăng nhập thành công!");
        window.location.href = '/web/chat_clients.html'; // Hoặc trang chính của bạn

      } else {
        alert("Lỗi ở login: "+ data.message);
      }
    } catch (err) {
      alert("Lỗi đăng nhập: " + err.message);
    }
  });
});
