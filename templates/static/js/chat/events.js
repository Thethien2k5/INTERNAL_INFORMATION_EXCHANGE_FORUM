// templates/static/js/chat/events.js

import { doms } from './ui.js';
import { executeSend } from './main.js'; // Import hàm gửi tin từ main.js

export function setupEventListeners() {
    doms.sendBtn.addEventListener("click", executeSend);

    doms.messageInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            executeSend();
        }
    });

    doms.messageInput.addEventListener("input", function () {
        this.style.height = "auto";
        this.style.height = `${Math.min(this.scrollHeight, 120)}px`;
        dom.sendBtn.disabled = this.value.trim() === "";
    });
}