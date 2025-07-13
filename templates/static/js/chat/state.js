const userString = localStorage.getItem("user");


export  const state = {
    user: userString ? JSON.parse(userString) : null,
    currentForumId: null,
    socket: null,
    membersCache: new Map(), // Lưu cache danh sách thành viên của từng nhóm
}