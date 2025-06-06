document.addEventListener('DOMContentLoaded', () => {
  const avatarInput = document.getElementById('avatar-input');
  const avatarPreview = document.getElementById('avatar-preview');
  const form = document.querySelector('form');

  // Load dữ liệu user từ localStorage nếu có
  const userData = JSON.parse(localStorage.getItem('user')) || {};
  const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
  
  // Ưu tiên dữ liệu từ userProfile nếu có, nếu không thì dùng từ user
  if (userProfile.avatar || userData.avatar) avatarPreview.src = userProfile.avatar || userData.avatar;
  if (userProfile.ho || userData.ho) document.getElementById('ho').value = userProfile.ho || userData.ho;
  if (userProfile.ten || userData.ten) document.getElementById('ten').value = userProfile.ten || userData.ten;
  if (userProfile.gioitinh || userData.gioitinh) {
    const genderRadios = document.getElementsByName('gioitinh');
    genderRadios.forEach(radio => {
      if (radio.value === (userProfile.gioitinh || userData.gioitinh)) radio.checked = true;
    });
  }

  // Khi người dùng chọn ảnh, hiển thị preview
  avatarInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
      avatarPreview.src = event.target.result; // Dữ liệu ảnh dạng base64
    };
    reader.readAsDataURL(file);
  });

  // Xử lý lưu thông tin khi submit form
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const ho = document.getElementById('ho').value.trim();
    const ten = document.getElementById('ten').value.trim();
    const gender = document.querySelector('input[name="gioitinh"]:checked').value;
    const avatar = avatarPreview.src; // Lấy avatar hiện tại

    if (!ho || !ten) {
      alert("Vui lòng nhập đầy đủ họ và tên");
      return;
    }

    // Tạo object userProfile lưu vào localStorage
    const userProfile = {
      ho,
      ten,
      name: ho + ' ' + ten,
      gioitinh: gender,
      avatar
    };

    // Lưu vào cả user và userProfile
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    // Cập nhật lại thông tin user hiện tại nếu đang đăng nhập
    if (localStorage.getItem('token')) {
      const currentUser = JSON.parse(localStorage.getItem('user')) || {};
      const updatedUser = { ...currentUser, ...userProfile };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    alert("Lưu thông tin thành công!");
  });
});