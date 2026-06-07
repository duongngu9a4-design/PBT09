// --- QUẢN LÝ DỮ LIỆU (State) ---
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all"; // Mặc định hiển thị tất cả

// --- LẤY CÁC THÀNH PHẦN DOM ---
const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const filterButtons = document.querySelectorAll("#filters button");
const clearCompletedBtn = document.getElementById("clearCompleted");

// --- CẬP NHẬT LOCALSTORAGE VÀ GIAO DIỆN ---
function saveAndRender() {
    localStorage.setItem("todos", JSON.stringify(todos));
    render();
}

// --- HÀM RENDER CHÍNH (BẮT BUỘC DÙNG CREATEELEMENT) ---
function render() {
    todoList.innerHTML = ""; // Xóa danh sách cũ trước khi vẽ lại

    // Lọc danh sách theo bộ lọc hiện tại trước khi vẽ
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === "active") return !todo.completed;
        if (currentFilter === "completed") return todo.completed;
        return true; // case 'all'
    });

    filteredTodos.forEach(todo => {
        // 1. Tạo thẻ <li> bọc ngoài cùng
        const li = document.createElement("li");
        li.className = `todo-item ${todo.completed ? "completed" : ""}`;
        li.dataset.id = todo.id; // Gắn ID để Event Delegation dễ tra cứu

        if (todo.isEditing) {
            // Nếu đang trong chế độ Edit -> Tạo thẻ <input>
            const input = document.createElement("input");
            input.type = "text";
            input.className = "edit-input";
            input.value = todo.text;
            li.appendChild(input);
        } else {
            // Chế độ xem bình thường -> Tạo thẻ <span> text và nút xóa
            const span = document.createElement("span");
            span.className = "todo-text";
            span.textContent = todo.text;

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn-delete";
            deleteBtn.textContent = "❌";

            li.appendChild(span);
            li.appendChild(deleteBtn);
        }

        todoList.appendChild(li);
    });

    // Cập nhật số lượng items còn lại (chỉ tính những việc chưa hoàn thành)
    const activeCount = todos.filter(t => !t.completed).length;
    todoCount.textContent = `${activeCount} item${activeCount !== 1 ? "s" : ""} left`;
}

// --- CHỨC NĂNG 1: THÊM TODO ---
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (!text) return;

    const newTodo = {
        id: Date.now().toString(), // Tạo id ngẫu nhiên không trùng
        text: text,
        completed: false,
        isEditing: false
    };

    todos.push(newTodo);
    todoInput.value = "";
    saveAndRender();
});

// --- CHỨC NĂNG VÀNG: EVENT DELEGATION (BẮT SỰ KIỆN TẠI #TODOLIST) ---
todoList.addEventListener("click", (e) => {
    const li = e.target.closest(".todo-item");
    if (!li) return;
    const id = li.dataset.id;

    // A. Xử lý click nút xóa ❌
    if (e.target.classList.contains("btn-delete")) {
        todos = todos.filter(todo => todo.id !== id);
        saveAndRender();
    }
    
    // B. Xử lý click vào chữ để Toggle hoàn thành
    if (e.target.classList.contains("todo-text")) {
        const todo = todos.find(todo => todo.id !== id);
        if (todo) {
            todo.completed = !todo.completed;
            saveAndRender();
        }
    }
});

// --- CHỨC NĂNG 2: DOUBLE CLICK ĐỂ SỬA (EDIT TODO) ---
todoList.addEventListener("dblclick", (e) => {
    if (e.target.classList.contains("todo-text")) {
        const id = e.target.closest(".todo-item").dataset.id;
        const todo = todos.find(todo => todo.id === id);
        if (todo) {
            todo.isEditing = true;
            render(); // Render lại để đổi text thành input

            // Tự động focus vào ô input vừa tạo
            const input = todoList.querySelector(`[data-id="${id}"] .edit-input`);
            if (input) {
                input.focus();
                
                // Lưu lại khi bấm Enter hoặc click ra ngoài (blur)
                input.addEventListener("keydown", (event) => {
                    if (event.key === "Enter") saveEdit(id, input.value);
                    if (event.key === "Escape") {
                        todo.isEditing = false;
                        render();
                    }
                });
                input.addEventListener("blur", () => saveEdit(id, input.value));
            }
        }
    }
});

// Hàm hỗ trợ lưu nội dung sau khi edit xong
function saveEdit(id, newText) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        if (newText.trim()) {
            todo.text = newText.trim();
        } else {
            // Nếu xóa hết chữ thì coi như xóa todo luôn
            todos = todos.filter(t => t.id !== id);
        }
        todo.isEditing = false;
        saveAndRender();
    }
}

// --- CHỨC NĂNG 3: BỘ LỌC HIỂN THỊ (FILTER) ---
document.getElementById("filters").addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
        // Cập nhật class active cho nút bấm
        filterButtons.forEach(btn => btn.classList.remove("active"));
        e.target.classList.add("active");

        // Cập nhật điều kiện lọc và render
        currentFilter = e.target.dataset.filter;
        render();
    }
});

// --- CHỨC NĂNG 4: XÓA CÁC VIỆC ĐÃ HOÀN THÀNH (CLEAR COMPLETED) ---
clearCompletedBtn.addEventListener("click", () => {
    todos = todos.filter(todo => !todo.completed);
    saveAndRender();
});

// --- KHỞI CHẠY LẦN ĐẦU TIÊN KHI TRANG LOAD XONG ---
render();