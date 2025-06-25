document.addEventListener("DOMContentLoaded", () => {
  const avatarInput = document.getElementById("avatar-input");
  const avatarPreview = document.getElementById("avatar-preview");
  const defaultAvatarPreview = document.getElementById(
    "default-avatar-preview"
  );

  const form = document.querySelector("form");
  const idInput = document.getElementById("id");
  const nameInput = document.getElementById("name");

  let selectedAvatarFile = null; // Biến để lưu file ảnh người dùng đã chọn (nếu có)

  //====Hiện thị thông tin từ thông tin lưu trên localStorage=====
  // Hàm hiển thị avatar
  const displayAvatar = (avatarUrl) => {
    if (avatarUrl) {
      // if (avatarUrl.startsWith("/")) {
      //   avatarPreview.src = avatarUrl;
      // } else {
      //   avatarPreview.src = "/" + avatarUrl;
      // }
      avatarPreview.src = "/uploads/" + avatarUrl;
      avatarPreview.style.display = "block";
      defaultAvatarPreview.style.display = "none";
    } else {
      //Nếu không có avatar
      avatarPreview.src = "/templates/static/images/khongbiet.jpg";
      avatarPreview.style.display = "none";
      defaultAvatarPreview.style.display = "block";
    }
  };

  // Tải thông tin từ localStorage
  const loadUserProfile = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      alert("Bạn cần đăng nhập để xem thông tin.");
      window.location.href = "/login.html";
      return;
    }

    let user;
    try {
      user = JSON.parse(storedUser);
    } catch (err) {
      console.error("Lỗi khi parse user:", err);
      alert("Thông tin người dùng không hợp lệ.");
      return;
    }

    displayAvatar(user.avatar);
    nameInput.value = user.Name || "";
    idInput.value = user.id || "";

    // Gán giới tính nếu có
    if (user.gender !== undefined && user.gender !== null) {
      const genderRadios = document.querySelectorAll("input[name='gioitinh']");
      genderRadios.forEach((radio) => {
        radio.checked = radio.value === String(user.gender);
      });
    }
  };

  //===========Cập nhật thông tin user========
  avatarInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    selectedAvatarFile = file;

    const reader = new FileReader();
    reader.onload = function (event) {
      avatarPreview.src = event.target.result;
      avatarPreview.style.display = "block";
      defaultAvatarPreview.style.display = "none";
    };
    reader.readAsDataURL(file);
  });

  // Xử lý submit form
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      return;
    }

    // Lấy giá trị giới tính hiện tại từ form
    const selectedGenderInput = document.querySelector(
      'input[name="gioitinh"]:checked'
    );
    const genderValue = selectedGenderInput ? selectedGenderInput.value : null;

    // Tạo đối tượng FormData để gửi cả text và file
    const formData = new FormData();

    const currentUser = JSON.parse(localStorage.getItem("user"));
    formData.append("userId", currentUser.id); 
    formData.append("Name", nameInput.value.trim());

    if (genderValue !== null) {
      formData.append("gender", genderValue);
    }

    // Nếu người dùng đã chọn một file ảnh mới, thêm nó vào formData
    if (selectedAvatarFile) {
      formData.append("avatar", selectedAvatarFile);
    }

    const apiURL = API_CONFIG.getApiUrl();

    try {
      const res = await fetch(`${apiURL}/api/user/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert("Cập nhật thông tin thành công!");
        // Cập nhật lại localStorage với thông tin mới
        const updatedUser = {
          ...currentUser,
          ...data.user,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Tải lại thông tin mới sau khi cập nhật thành công
        loadUserProfile();
      } else {
        alert("Cập nhật thất bại: " + data.message);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật profile:", error);
      alert("Đã xảy ra lỗi khi cập nhật.");
    }
  });

  // Khởi động
  loadUserProfile();
});
