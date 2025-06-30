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

//Loading hiệu ứng
function showLoader() {
  const overlay = document.getElementById("loadingOverlay");
  if (overlay) overlay.style.display = "flex";
}

function hideLoader() {
  const overlay = document.getElementById("loadingOverlay");
  if (overlay) overlay.style.display = "none";
}

// xử lý đăng nhập
const loginForm = document.getElementById("loginForm");
const loginSubmitBtn = document.getElementById("loginSubmitBtn");
if (loginForm && loginSubmitBtn) {
  loginSubmitBtn.addEventListener("click", async () => {
    // Không còn tham số event (e) và không cần e.preventDefault() nữa
    showLoader();

    const username = loginForm.username.value.trim();
    const password = loginForm.password.value;
    const apiURL = API_CONFIG.getApiUrl();

    try {
     
      const res = await fetch(apiURL + "/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
    

      const data = await res.json();

      if (data.success) {
        // Lưu Access Token vào localStorage
        localStorage.setItem("accessToken", data.accessToken);

        // Dùng JSON.stringify để chuyển object thành chuỗi trước khi lưu
        localStorage.setItem("user", JSON.stringify(data.user));
        hideLoader(); ////
        alert("Đăng nhập thành công!");
        window.location.href = "./index"; // Hoặc trang chính của bạn
      } else {
        hideLoader(); ////
        alert("Lỗi ở login: " + data.message);
      }
    } catch (err) {
      hideLoader(); ////
      alert("(login.js)Tài khoản không tồn tại: " + err.message);
    }
  });
  loginForm.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      loginSubmitBtn.click();
    }
  });
}