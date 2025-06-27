(async function initCoursesPage() {
  console.log("Hàm initCoursesPage() đã được gọi.");

  const tableBody = document.getElementById("course-table-body");

  if (!tableBody) {
    console.error(
      "Không tìm thấy #course-table-body. Script có thể đang chạy quá sớm."
    );
    return;
  }

  try {
    const response = await fetch("/api/courses");

    if (!response.ok) {
      throw new Error("Không thể lấy dữ liệu học phần");
    }

    const result = await response.json();

    if (result.success && result.data.length > 0) {
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
      tableBody.innerHTML = `<tr class="no-data-row"><td colspan="7">Không có dữ liệu</td></tr>`;
    }
  } catch (err) {
    console.error("Lỗi khi tải danh sách học phần:", err);
    tableBody.innerHTML = `<tr class="no-data-row"><td colspan="7">Lỗi khi tải dữ liệu</td></tr>`;
  }

  // Đăng ký/hủy đăng ký
  document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("register-button")) {
      const row = event.target.closest("tr");
      if (!row) return;

      const courseID = row.children[1].textContent;
      const user = localStorage.getItem("user");

      if (!user) {
        alert("Bạn cần đăng nhập để đăng ký.");
        return;
      }

      let userID;
      try {
        userID = JSON.parse(user).id;
      } catch (e) {
        console.error("Lỗi phân tích user:", e);
        alert("Thông tin người dùng không hợp lệ.");
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
          alert("Bạn đã đăng ký học phần này\nVui lòng không thao tác lại");
        }
      } catch (err) {
        console.error("Lỗi khi gửi yêu cầu:", err);
        alert("Đã xảy ra lỗi khi đăng ký.");
      }
    }
  });
})();
