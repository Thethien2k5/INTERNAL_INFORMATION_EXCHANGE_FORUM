  const registerForm = document.getElementById("registerForm");
  const otpBox = document.getElementById("otpBox");
  const loader = document.getElementById("loadingOverlay");
  const registerBtn = document.getElementById("registerBtn");
  let generatedOTP = "";
  let userEmail = "";

  function showLoader() {
    if (loader) loader.style.display = "flex";
  }

  function hideLoader() {
    if (loader) loader.style.display = "none";
  }

  if (!registerForm) {
      console.error("Không tìm thấy form với id='registerForm'!");
      return; // Dừng lại nếu không tìm thấy form
  }
  if (registerForm && registerBtn) {
    registerBtn.addEventListener("click", async () => {
      // Không còn e và e.preventDefault()
      showLoader();

      const apiURL = API_CONFIG.getApiUrl();
      const username = document.getElementById("reg-username").value.trim();
      const email = document.getElementById("reg-email").value.trim();
      const password = document.getElementById("reg-password").value.trim();
      const otpInput = document.getElementById("otp-input")?.value || "";

      const otpBoxVisible = window.getComputedStyle(otpBox).display !== "none";

      // Nếu chưa hiển thị ô nhập OTP
      if (!otpBoxVisible) {
        if (!username || !email || !password) {
          hideLoader();
          alert("Vui lòng điền đầy đủ thông tin!");
          return;
        }

        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          hideLoader();
          alert("Email không hợp lệ!");
          return;
        }

        try {
          const response = await fetch(apiURL + "/api/send-otp", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ email, username }),
          });

          const data = await response.json();

          if (!response.ok || !data.success) {
            hideLoader();
            alert(data.message || `Lỗi gửi OTP`);
            return;
          }

          generatedOTP = data.otp;
          userEmail = email;

          otpBox.style.display = "block";
          hideLoader();

          setTimeout(() => {
            alert(`Mã OTP đã được gửi đến email: ${email}`);
          }, 100);
        } catch (error) {
          hideLoader();
          alert("Không thể gửi OTP. Vui lòng thử lại sau!\nLỗi: " + error.message);
        }
      }
      // Nếu đang nhập OTP
      else {
        if (!otpInput) {
          hideLoader();
          alert("Vui lòng nhập mã OTP!");
          return;
        }

        if (otpInput !== generatedOTP) {
          hideLoader();
          alert("Mã OTP không chính xác!");
          return;
        }

        if (email !== userEmail) {
          hideLoader();
          alert("Email không trùng với email đã đăng ký OTP!");
          return;
        }

        try {
          const res = await fetch(apiURL + "/api/add-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ username, email, password }),
          });

          const result = await res.json();
          hideLoader();

          if (result.success) {
            generatedOTP = "";
            userEmail = "";

            setTimeout(() => {
              alert("Đăng ký thành công!");
              window.location.reload();
            }, 100);
          } else {
            alert(result.message || "Đăng ký thất bại!");
          }
        } catch (err) {
          hideLoader();
          alert("Lỗi khi đăng ký: " + err.message);
        }
      }
    });

  registerForm.addEventListener("keydown", function (e) {
          if (e.key === "Enter") {
              e.preventDefault();
              registerBtn.click();
          }
      });
}
