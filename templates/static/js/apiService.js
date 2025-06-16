
const apiService = {

    async fetch(url, options = {}) {
        // Lấy token từ localStorage
        let accessToken = localStorage.getItem('accessToken');
        
        // Thiết lập header mặc định
        options.headers = {
            ...options.headers,
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        };

        // Gọi API lần đầu
        let response = await fetch(API_CONFIG.getApiUrl() + url, options);

        // Nếu gặp lỗi 401 hoặc 403 (do token hết hạn)
        if (response.status === 401 || response.status === 403) {
            console.log('Access Token đã hết hạn.');
            
            const refreshSuccess = await this.refreshToken();

            if (refreshSuccess) {
                console.log('Làm mới Token thành công.');
                // Lấy token mới và cập nhật lại header
                accessToken = localStorage.getItem('accessToken');
                options.headers['Authorization'] = `Bearer ${accessToken}`;
                
                // Gọi lại API ban đầu với token mới
                response = await fetch(API_CONFIG.getApiUrl() + url, options);
            } else {
                // Nếu làm mới token thất bại, đăng xuất người dùng
                console.log('Làm mới Token thất bại. Đang đăng xuất.');
                this.logout();
                // Ném lỗi để dừng tiến trình
                return Promise.reject('Phiên đăng nhập hết hạn.');
            }
        }
        
        // Nếu response không thành công sau tất cả các bước, ném lỗi
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Có lỗi xảy ra ở file apiService.js.');
        }

        return response.json();
    },

    
    // Hàm gọi API /refresh-token để lấy Access Token mới.
    async refreshToken() {
        try {
            const response = await fetch(API_CONFIG.getApiUrl() + '/refresh-token', {
                method: 'POST',
            });

            if (!response.ok) return false;

            const data = await response.json();
            if (data.success && data.accessToken) {
                // Lưu access token mới vào localStorage
                localStorage.setItem('accessToken', data.accessToken);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Lỗi khi gọi API refresh-token:', error);
            return false;
        }
    },
    
    createForum: function(forumData) {
        // Hàm này sẽ gọi API để tạo forum mới
        // 'this.fetch' sẽ tự động thêm token xác thực
        return this.fetch('/api/forums', {
            method: 'POST',
            body: JSON.stringify(forumData)
        });
    },



    // Hàm đăng xuất
    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    }

    
};