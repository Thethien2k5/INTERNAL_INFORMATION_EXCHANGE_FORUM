document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const otpBox = document.getElementById("otpBox");
  let generatedOTP = "";
  let userEmail = "";

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("reg-username").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
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
        console.log("Dữ liệu gửi đi:", {
          email,
          username,
          otp: generatedOTP,
        });

        // Gọi API để gửi OTP
        const response = await fetch("http://localhost:5000/api/send-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
            username,
            otp: generatedOTP,
          }),
        });

        console.log("Response status:", response.status);
        //Lỗi khi name và email đã tồn tại
        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.message || `HTTP error! status: ${response.status}`);
          return;
        }
        // Lưu email người dùng // Tạo OTP
        userEmail = email;
        generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

        const data = await response.json();
        console.log("Server response:", data);

        if (data.success) {
          console.log("Email đã được gửi tới:", email);
          // Hiển thị ô nhập OTP
          otpBox.style.display = "block";
          alert(
            `Mã OTP đã được gửi đến email: ${email}\nVui lòng kiểm tra cả thư mục spam nếu không thấy trong hộp thư đến.`
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
        alert("Đăng ký thành công!");

        // F5 quay về trạng thái đăng nhập
        window.location.reload();
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
