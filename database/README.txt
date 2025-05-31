📁 Mô tả cấu trúc và các bảng CSDL sử dụng

🔹 1. Bảng if_users – Quản lý người dùng
Mục tiêu:
Lưu trữ thông tin tài khoản người dùng đăng ký vào hệ thống.
Nội dung chính:
Tên đăng nhập (username), email, mật khẩu đã hash.
Trạng thái xác minh email (email_verified_at).
Thời gian tạo/sửa tài khoản.
Chức năng:
Quản lý đăng ký/đăng nhập.
Xác thực người dùng.
Quản lý quyền truy cập vào các diễn đàn.

🔹 2. Bảng if_forums – Quản lý các diễn đàn
Mục tiêu:
Lưu thông tin về các diễn đàn (sub-forums) được người dùng tạo ra.
Nội dung chính:
Tên diễn đàn, mô tả, mật khẩu (đã hash).
Ai là người tạo (created_by_user_id).
Thời gian tạo và cập nhật.
Chức năng:
Tạo diễn đàn với mật khẩu để hạn chế thành viên.
Phân loại và quản lý các nhóm trao đổi.
Gắn kết với người dùng tạo diễn đàn.

🔹 3. Bảng if_forum_members – Thành viên trong diễn đàn
Mục tiêu:
Quản lý mối quan hệ nhiều-nhiều giữa người dùng và diễn đàn.
Nội dung chính:
Ai là thành viên của diễn đàn nào.
Thời điểm tham gia (joined_at).
Chức năng:
Kiểm tra quyền truy cập vào diễn đàn.
Gửi và nhận tin nhắn trong diễn đàn.
Quản lý danh sách thành viên.

🔹 4. Bảng if_messages – Tin nhắn và tập tin trong diễn đàn
Mục tiêu:
Lưu lại toàn bộ các tin nhắn hoặc tập tin được gửi trong diễn đàn.
Nội dung chính:
Loại nội dung (text hoặc file).
Văn bản, tên file, đường dẫn, kích thước file, MIME type.
Ai gửi và gửi ở diễn đàn nào.
Chức năng:
Hiển thị lịch sử trao đổi trong diễn đàn.
Hỗ trợ chia sẻ tài liệu, hình ảnh, v.v.
Gắn kết với người gửi và diễn đàn chứa nội dung đó.

🔁 Tóm tắt quan hệ giữa các bảng:
Bảng cha	Bảng con	      Mối quan hệ	  Ý nghĩa
if_users	if_forums	      1 - nhiều	      Người dùng tạo ra nhiều diễn đàn.
if_users	if_forum_members  nhiều - nhiều	  Người dùng tham gia nhiều diễn đàn.
if_users	if_messages	      1 - nhiều	      Người dùng gửi nhiều tin nhắn.
if_forums	if_messages	      1 - nhiều	      Mỗi diễn đàn chứa nhiều tin nhắn.