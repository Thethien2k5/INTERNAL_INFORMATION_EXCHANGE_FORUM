
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const otpBox = document.getElementById("otpBox");
  let generatedOTP = "";
  let userEmail = "";
  
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const apiURL = API_CONFIG.getApiUrl();
    const username = document.getElementById("reg-username").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value.trim();
    const otpInput = document.getElementById("otp-input")?.value || "";

    console.log("Form submitted with:", {
      username,
      email,
      otpInput,
      storedOTP: generatedOTP,
      storedEmail: userEmail,
      isOTPBoxVisible: otpBox.style.display !== "none",
    });

    // Nếu chưa hiển thị OTP box
    if (otpBox.style.display === "none") {
      // Kiểm tra form
      if (!username || !email || !password) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
      }

      // Validate email format
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        alert("Email không hợp lệ!");
        return;
      }

      try {
        console.log("Chuẩn bị gửi OTP đến:", email);
        console.log("Dữ liệu gửi đi:", { email, username });

        // Gọi API để gửi OTP
        const response = await fetch(apiURL+'/api/send-otp', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
            username,
          }),
        });

        // Lỗi khi name và email đã tồn tại
        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.message || `HTTP error! status: ${response.status}`);
          return;
        }

        // Đến đây mới tạo OTP và lưu email
        userEmail = email;

        console.log("Response status:", response.status);

        const data = await response.json();
        console.log("Server response:", data);

        if (data.success) {
          generatedOTP = data.otp;
          userEmail = email;
          console.log("OTP nhận từ backend:", generatedOTP);

          otpBox.style.display = "block";
          alert(
            `Mã OTP đã được gửi đến email: ${email}.`
          );
        } else {
          throw new Error(data.message || "Lỗi không xác định khi gửi OTP");
        }
      } catch (error) {
        console.error("Chi tiết lỗi gửi OTP:", error);
        alert(
          "Không thể gửi mã OTP. Vui lòng thử lại sau! Lỗi: " + error.message
        );
      }
    } else {
      // Kiểm tra OTP
      console.log("Validating OTP:", {
        input: otpInput,
        stored: generatedOTP,
        email: email,
        storedEmail: userEmail,
      });

      if (!otpInput) {
        alert("Vui lòng nhập mã OTP!");
        return;
      }

      if (otpInput === generatedOTP && email === userEmail) {
        console.log("OTP validation successful");
        // Gọi API thêm user mới
        try {
          const res = await fetch(apiURL+'/api/add-user', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              username,
              email,
              password,
            }),
          });
          const result = await res.json();
          if (result.success) {
            alert("Đăng ký thành công!");
            window.location.reload();
          } else {
            alert(result.message || "Đăng ký thất bại!");
          }
        } catch (err) {
          alert("Lỗi đăng ký: " + err.message);
        }
      } else {
        console.log("OTP validation failed");
        if (otpInput !== generatedOTP) {
          alert("Mã OTP không chính xác!");
        } else {
          alert("Email không khớp với email đã đăng ký!");
        }
      }
    }
  });
});
