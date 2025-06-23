document.addEventListener('DOMContentLoaded', () => {
    const avatarInput = document.getElementById('avatar-input');
    const avatarPreview = document.getElementById('avatar-preview');
    const defaultAvatarPreview = document.getElementById('default-avatar-preview');
    const form = document.querySelector('form');
    const nameInput = document.getElementById('name');
    const idInput = document.getElementById('id');

    // Biến để lưu file ảnh người dùng đã chọn (nếu có)
    let selectedAvatarFile = null;

    // Hàm để lấy thông tin user từ server và điền vào form
    const loadUserProfile = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('Bạn chưa đăng nhập!');
            window.location.href = '/login.html';
            return;
        }

        const apiURL = API_CONFIG.getApiUrl();

        try {
            const res = await fetch(`${apiURL}/api/user/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (data.success) {
                const user = data.user;
                // Điền thông tin vào form
                if (user.avatar) {
                    avatarPreview.src = user.avatar;
                    avatarPreview.style.display = 'block';
                    defaultAvatarPreview.style.display = 'none';
                } else {
                    avatarPreview.style.display = 'none';
                    defaultAvatarPreview.style.display = 'block';
                }
                nameInput.value = user.name || '';
                idInput.value = user.id || '';
                // Cập nhật lại localStorage với dữ liệu mới nhất
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                alert('Không thể lấy thông tin người dùng: ' + data.message);
            }
        } catch (error) {
            console.error('Lỗi khi tải thông tin user:', error);
            alert('Đã xảy ra lỗi khi tải thông tin.');
        }
    };

    // Khi người dùng chọn ảnh mới
    avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Lưu lại file đã chọn để gửi lên server
        selectedAvatarFile = file;

        // Hiển thị ảnh preview cho người dùng xem
        const reader = new FileReader();
        reader.onload = function (event) {
            avatarPreview.src = event.target.result;
            avatarPreview.style.display = 'block';
            defaultAvatarPreview.style.display = 'none';
        };
        reader.readAsDataURL(file);
    });

    // Khi người dùng nhấn nút "Lưu thông tin"
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            return;
        }

        // Tạo đối tượng FormData để gửi cả text và file
        const formData = new FormData();
        formData.append('Name', nameInput.value.trim());
        formData.append('id', idInput.value.trim());

        // Nếu người dùng đã chọn một file ảnh mới, thêm nó vào formData
        if (selectedAvatarFile) {
            formData.append('avatar', selectedAvatarFile);
        }

        const apiURL = API_CONFIG.getApiUrl();

        try {
            const res = await fetch(`${apiURL}/api/user/profile`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();

            if (data.success) {
                alert('Cập nhật thông tin thành công!');
                // Tải lại thông tin mới sau khi cập nhật thành công
                await loadUserProfile();
                window.location.reload(); // Tải lại trang để sidebar cập nhật
            } else {
                alert('Cập nhật thất bại: ' + data.message);
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật profile:', error);
            alert('Đã xảy ra lỗi khi cập nhật.');
        }
    });

    // Chạy hàm tải thông tin khi trang được load
    loadUserProfile();
});