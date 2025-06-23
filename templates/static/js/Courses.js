// ///Chèn bảng Danh sách học phần vào khung chat và khung thông tin nhóm
// document.addEventListener("DOMContentLoaded", function () {
//     const courseLink = document.querySelector('.category-title a[href="#"]');
//     const appContainer = document.querySelector(".app-container");
//     const chatContainer = document.querySelector(".chat-container");
//     const infoSidebar = document.querySelector(".info-sidebar");

//     courseLink.addEventListener("click", function (e) {
//         e.preventDefault();

//         // Ẩn khung chat + thông tin nhóm
//         chatContainer.style.display = "none";
//         infoSidebar.style.display = "none";

//         // Nếu iframe đã tồn tại thì không tạo thêm
//         if (document.getElementById("courseIframe")) return;

//         // Tạo iframe toàn phần bên phải
//         const iframe = document.createElement("iframe");
//         iframe.id = "courseIframe";
//         iframe.src = "Courses.html";
//         iframe.style.width = "100%";
//         iframe.style.height = "100vh";
//         iframe.style.border = "none";
//         iframe.style.flex = "1"; // chiếm phần còn lại
//         iframe.style.background = "#fff";

//         // Thêm iframe vào appContainer
//         appContainer.appendChild(iframe);
//     });
// });

///==== In ra bảng danh sách học phần
document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("course-table-body");

  try {
    const response = await fetch("/api/courses"); // Gọi BE lấy data
    const result = await response.json();

    if (result.success && result.data.length > 0) {
      // Xóa hàng "Không có dữ liệu"
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
      document.querySelector(".no-data-row").style.display = "table-row";
    }
  } catch (err) {
    console.error("Lỗi khi tải danh sách học phần:", err);
    document.querySelector(".no-data-row").style.display = "table-row";
  }
});

///Tính năng đăng ký/ hủy đăng ký
document.addEventListener("click", async (event) => {
  if (event.target.classList.contains("register-button")) {
    const row = event.target.closest("tr");
    const courseID = row.children[1].textContent;

    // ✅ Lấy userID từ localStorage
    const user = localStorage.getItem("user");

    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        var userID = parsedUser.id;
      } catch (e) {
        console.error("Lỗi khi phân tích user từ localStorage:", e);
      }
    }
    if (!userID) {
      alert("Bạn cần đăng nhập để đăng ký.");
      return;
    }
    
    try {
      const res = await fetch("/api/AddAccordingToCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({userID, courseID}),
      });

      const result = await res.json();
      if (result.success) {
        alert("Đăng ký thành công và đã thêm vào nhóm chat.");
      } else {
        alert("Lỗi: " + result.message);
      }
    } catch (err) {
      console.error("Lỗi khi gửi request đăng ký:", err);
    }
  }
});


