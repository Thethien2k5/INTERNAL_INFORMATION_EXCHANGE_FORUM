console.log("JS đã được load!");

document.addEventListener("DOMContentLoaded", () => {
  const avatarInput = document.getElementById("avatar-input");
  const avatarPreview = document.getElementById("avatar-preview");
  const defaultAvatarPreview = document.getElementById(
    "default-avatar-preview"
  );

  const form = document.querySelector("form");
  const idInput = document.getElementById("id");
  const nameInput = document.getElementById("name");
  // Lấy input radio được chọn trong nhóm có name="gioitinh"
  const selectedGenderInput = document.querySelector(
    'input[name="gioitinh"]:checked'
  );
  let genderValue = selectedGenderInput ? selectedGenderInput.value : null; //Lưu giới tính (nam = 0 nữ = 1)

  let selectedAvatarFile = null; // Biến để lưu file ảnh người dùng đã chọn (nếu có)

  //====Hiện thị thông tin từ thông tin lưu trên localStorage=====
  // Hàm hiển thị avatar
  const displayAvatar = (avatarUrl) => {
    if (avatarUrl) {
      if (avatarUrl.startsWith("/")) {
        avatarPreview.src = avatarUrl;
      } else {
        avatarPreview.src = "/" + avatarUrl;
      }
      avatarPreview.style.display = "block";
      defaultAvatarPreview.style.display = "none";
    } else {
      //Nếu không tìm đc
      avatarPreview.src ="/templates/static/images/khongbiet.jpg";
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
      // displayAvatar(event.target.result);

      avatarPreview.src = event.target.result;
      avatarPreview.style.display = "block";
      defaultAvatarPreview.style.display = "none";
    };
    reader.readAsDataURL(file);
  });
  ////
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      return;
    }

    // Tạo đối tượng FormData để gửi cả text và file
    const formData = new FormData();

    formData.append("id", JSON.parse(localStorage.getItem("user")).id); //Lấy user từ local để đảm bảo

    formData.append("Name", nameInput.value.trim());
    formData.append("gender", genderValue);

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
        //cập cập nhật lại local
        localStorage.setItem("user", JSON.stringify(data.user));
        // Tải lại thông tin mới sau khi cập nhật thành công
        await loadUserProfile();
        // window.location.reload(); // Tải lại trang để sidebar cập nhật
      } else {
        alert("Cập nhật thất bại: " + data.message);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật profile:", error);
      alert("Đã xảy ra lỗi khi cập nhật.");
    }
  });

  // // Khi người dùng nhấn "Lưu"
  // form.addEventListener("submit", async (e) => {
  //   e.preventDefault();

  //   const token = localStorage.getItem("accessToken");
  //   if (!token) {
  //     alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("name", nameInput.value.trim());

  //   const selectedGender = document.querySelector(
  //     "input[name='gioitinh']:checked"
  //   )?.value;
  //   if (selectedGender) {
  //     formData.append("gender", selectedGender);
  //   }

  //   if (selectedAvatarFile) {
  //     formData.append("avatar", selectedAvatarFile);
  //   }

  //   const apiURL = API_CONFIG.getApiUrl();

  //   try {
  //     const res = await fetch(`${apiURL}/api/user/profile`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: formData,
  //     });

  //     const data = await res.json();
  //     console.log("Server trả về:", data);

  //     if (data.success) {
  //       alert("Cập nhật thông tin thành công!");
  //       if (data.user) {
  //         localStorage.setItem("user", JSON.stringify(data.user));
  //       }
  //       window.location.reload();
  //     } else {
  //       alert("Cập nhật thất bại: " + data.message);
  //     }
  //   } catch (error) {
  //     console.error("Lỗi khi cập nhật profile:", error);
  //     alert("Đã xảy ra lỗi khi cập nhật.");
  //   }
  // });

  // Khởi động
  loadUserProfile();
});
