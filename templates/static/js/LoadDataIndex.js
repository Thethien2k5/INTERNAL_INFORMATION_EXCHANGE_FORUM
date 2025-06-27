// document.addEventListener('DOMContentLoaded', function () {
//   const mainContentArea = document.getElementById('main-content');
//   const navButtons = document.querySelectorAll('nav button'); // Tùy bạn có dùng <nav> hay không

//   if (!mainContentArea) {
//     console.error('Không tìm thấy thẻ <main> với id="main-content".');
//     return;
//   }

//   function extractAndExecuteScripts(html) {
//     const tempDiv = document.createElement("div");
//     tempDiv.innerHTML = html;

//     const scripts = tempDiv.querySelectorAll("script");

//     scripts.forEach((oldScript) => {
//       const newScript = document.createElement("script");

//       if (oldScript.src) {1
//         newScript.src = oldScript.src;
//         newScript.defer = true; // Tùy chọn: dùng defer để không block
//       } else {
//         newScript.textContent = oldScript.textContent;
//       }

//       document.body.appendChild(newScript);
//       oldScript.remove(); // Loại bỏ script gốc khỏi HTML
//     });

//     return tempDiv.innerHTML;
//   }

//   /**
//    * Hàm tải nội dung từ một URL và chèn vào main-content
//    * @param {string} url
//    * @param {boolean} pushState
//    */
//   async function loadContent(url, pushState = true) {
//     mainContentArea.innerHTML = '<p class="loading-indicator">Đang tải nội dung...</p>';

//     try {
//       const response = await fetch(url);

//       if (!response.ok) {
//         throw new Error(`Không thể tải trang: ${response.status}`);
//       }

//       const html = await response.text();
//       const cleanHtml = extractAndExecuteScripts(html);
//       mainContentArea.innerHTML = cleanHtml;

//       if (pushState) {
//         history.pushState({ path: url }, "", url);
//       }

//       console.log("Đã chèn nội dung từ:", url);
//     } catch (err) {
//       console.error("Lỗi khi tải nội dung:", err);
//       mainContentArea.innerHTML = `<p class="error-message">Lỗi: ${err.message}</p>`;
//     }
//   }

//   // Gắn click sự kiện (nếu có nav)
//   navButtons.forEach(button => {
//     button.addEventListener('click', function () {
//       const url = this.dataset.url;
//       if (url) {
//         loadContent(url);
//       }
//     });
//   });

//   // Xử lý quay lại/lùi trình duyệt
//   window.addEventListener("popstate", (event) => {
//     const path = event.state ? event.state.path : "home.html";
//     loadContent(path, false);
//   });

//   // Trang mặc định khi vào index
//   loadContent("home.html", false);
// });
