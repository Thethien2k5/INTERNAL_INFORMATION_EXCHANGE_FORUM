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

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    try {
      const apiURL = API_CONFIG.getApiUrl(); // Địa chỉ API đăng nhập
      const res = await fetch(`${apiURL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Lưu username
        localStorage.setItem("username", username);

        // Lưu avatar (nếu có), nếu không thì dùng ảnh mặc định
        const avatar = data.user?.avatar?.trim() || "templates/static/images/logoT3V.png";
        localStorage.setItem("avatar", avatar);

        // Nếu muốn lưu thêm token thì cần server trả về token (chưa thấy có)
        // localStorage.setItem("token", data.token); // Nếu server có trả về

        window.location.href = "index.html"; // Chuyển sang trang chính
      } else {
        alert(data.message || "Sai tên đăng nhập hoặc mật khẩu!");
      }
    } catch (err) {
      alert("Lỗi đăng nhập: " + err.message);
    }
  });
});
