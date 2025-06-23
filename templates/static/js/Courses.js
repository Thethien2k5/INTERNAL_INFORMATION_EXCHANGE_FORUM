// Bỏ đi trình bao bọc document.addEventListener("DOMContentLoaded", ...)
// và thay bằng một hàm có tên.

async function initCoursesPage() {
  console.log("Hàm initCoursesPage() đã được gọi."); // Thêm dòng này để kiểm tra
  const tableBody = document.getElementById("course-table-body");

  // Kiểm tra xem tableBody có tồn tại không trước khi thực hiện
  if (!tableBody) {
    console.error("Không tìm thấy #course-table-body. Script có thể đang chạy quá sớm.");
    return;
  }

  try {
    const response = await fetch("/api/courses"); // Gọi BE lấy data
    const result = await response.json();

    if (result.success && result.data.length > 0) {
      // Xóa hàng "Không có dữ liệu" (nếu có) và các nội dung cũ
      tableBody.innerHTML = "";

      result.data.forEach((course, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${course.CourseID}</td>
          <td>${course.CourseName}</td>
          <td>${course.Credits}</td>
          <td>${course.TuitionFee.toLocaleString()} VNĐ</td>
          <td><button class="register-button">Đăng ký</button></td>
          <td></td>
        `;
        tableBody.appendChild(row);
      });
    } else {
      // Đảm bảo hàng "Không có dữ liệu" được hiển thị nếu cần
      const noDataRow = tableBody.querySelector(".no-data-row");
      if (noDataRow) {
        noDataRow.style.display = "table-row";
      } else {
        tableBody.innerHTML = `<tr class="no-data-row"><td colspan="7">Không có dữ liệu</td></tr>`;
      }
    }
  } catch (err) {
    console.error("Lỗi khi tải danh sách học phần:", err);
    const noDataRow = tableBody.querySelector(".no-data-row");
    if (noDataRow) {
      noDataRow.style.display = "table-row";
    } else {
        tableBody.innerHTML = `<tr class="no-data-row"><td colspan="7">Lỗi khi tải dữ liệu</td></tr>`;
    }
  }
}

/// Tính năng đăng ký/ hủy đăng ký (Giữ nguyên vì đã dùng event delegation trên document)
document.addEventListener("click", async (event) => {
  if (event.target.classList.contains("register-button")) {
    const row = event.target.closest("tr");
    if (!row) return; // Đảm bảo row tồn tại

    const courseID = row.children[1].textContent;
    const user = localStorage.getItem("user");

    if (!user) {
      alert("Bạn cần đăng nhập để đăng ký.");
      return;
    }
    
    let userID;
    try {
      const parsedUser = JSON.parse(user);
      userID = parsedUser.id;
    } catch (e) {
      console.error("Lỗi khi phân tích user từ localStorage:", e);
      alert("Thông tin người dùng không hợp lệ.");
      return;
    }

    if (!userID) {
      alert("Bạn cần đăng nhập để đăng ký.");
      return;
    }

    try {
      const res = await fetch("/api/AddAccordingToCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID, courseID }),
      });

      const result = await res.json();
      if (result.success) {
        alert("Đăng ký thành công và đã thêm vào nhóm chat.");
      } else {
        alert("Lỗi: " + result.message);
      }
    } catch (err) {
      console.error("Lỗi khi gửi request đăng ký:", err);
      alert("Đã xảy ra lỗi khi cố gắng đăng ký. Vui lòng thử lại.");
    }
  }
});

// Nếu người dùng tải trực tiếp trang courses.html, chúng ta vẫn cần nó hoạt động
// Kiểm tra xem trang hiện tại có phải là courses.html không
if (window.location.pathname.endsWith('Courses.html')) {
    document.addEventListener('DOMContentLoaded', initCoursesPage);
}