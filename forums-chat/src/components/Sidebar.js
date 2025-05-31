
import React, { useEffect } from "react";
import '../components/css/Sidebar.css';

function Sidebar() {
     useEffect(() => {
        const themeIcon = document.getElementById("theme-icon");
        const themeToggle = document.querySelector(".theme-toggle");

        if (!themeToggle || !themeIcon) return;

        const savedTheme = localStorage.getItem("theme") || "light";
        document.documentElement.setAttribute("data-theme", savedTheme);
        updateThemeIcon(savedTheme);

        const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        updateThemeIcon(newTheme);
        };

        themeToggle.addEventListener("click", toggleTheme);

        return () => {
        themeToggle.removeEventListener("click", toggleTheme);
        };

        function updateThemeIcon(theme) {
        if (theme === "dark") {
            themeIcon.classList.remove("fa-moon");
            themeIcon.classList.add("fa-sun");
        } else {
            themeIcon.classList.remove("fa-sun");
            themeIcon.classList.add("fa-moon");
        }
        }
    }, []);


  return (
    
    <div id="slidebar">
      <input type="checkbox" id="menu-toggle" hidden />

      <label htmlFor="menu-toggle" className="menu-toggle">
        <i className="fa-solid fa-bars"></i>
      </label>

      <div className="menu">
        <div className="menu_header">
          <h2>Menu</h2>
        </div>
        <div className="menu_item">
          <a href="#">
            <i className="fa-solid fa-people-group"></i>
            <span>Diễn đàn hỏi đáp</span>
          </a>
        </div>
        <div className="menu_item">
          <a href="/templates/chat.html">
            <i className="fa-solid fa-comment"></i>
            <span>Chat</span>
          </a>
        </div>
        <div className="menu_item">
          <a href="#">
            <i className="fa-solid fa-phone"></i>
            <span>Trợ giúp 1900-2323</span>
          </a>
        </div>
        <div className="menu_item">
          <a href="#">
            <i className="fa-solid fa-bug"></i>
            <span>Góp ý</span>
          </a>
        </div>
      </div>

      <div className="navboard">
        <div className="navboard_header">
          <strong>Dashboard</strong>
        </div>

        <div className="nav-right">
          <ul>
            <li>
              {/* Theme Toggle */}
              <div className="theme-toggle">
                <i className="fa-solid fa-moon" id="theme-icon"></i>
              </div>
            </li>
            <li>
              {/* Notification */}
              <div className="bell">
                <i className="fa-regular fa-bell"></i>
              </div>
            </li>
            <li>
              {/* User */}
              <div id="user-container">
                <i className="fa-regular fa-circle-user"></i>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
