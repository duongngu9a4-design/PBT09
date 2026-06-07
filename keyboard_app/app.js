// --- 1. KHO DỮ LIỆU SẢN PHẨM / ẢNH MẪU ---
const images = [
    { id: 1, title: "Khung cảnh Hoàng hôn", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop" },
    { id: 2, title: "Thung lũng Xanh mướt", url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop" },
    { id: 3, title: "Hồ nước trên Núi", url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop" },
    { id: 4, title: "Cây cầu trong Sương", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop" },
    { id: 5, title: "Cánh rừng Mùa thu", url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop" },
    { id: 6, title: "Bãi biển Cát trắng", url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop" },
    { id: 7, title: "Cánh đồng Hoa oải hương", url: "https://images.unsplash.com/photo-1472214222541-d510753a4707?w=800&auto=format&fit=crop" },
    { id: 8, title: "Đường mòn leo Núi", url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&auto=format&fit=crop" },
    { id: 9, title: "Dòng suối chảy xiết", url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop" }
];

// Định nghĩa tập hợp dữ liệu các Lệnh Hệ Thống
const commands = [
    { action: "next", text: "Chuyển sang ảnh kế tiếp", key: "▶" },
    { action: "prev", text: "Quay lại ảnh phía trước", key: "◀" },
    { action: "play", text: "Bật/Tắt tự động chạy slideshow", key: "Space" },
    ...images.map(img => ({ action: `goto-${img.id}`, text: `Nhảy nhanh tới ảnh số ${img.id}: ${img.title}`, key: `${img.id}` }))
];

// --- 2. TRẠNG THÁI KHỞI TẠO (STATE CORES) ---
let currentIndex = 0;
let isPlaying = false;
let slideshowInterval = null;
let selectedCommandIndex = 0;
let lastFocusedElement = null; // Phục vụ cho Focus Management phục hồi tiêu điểm

// --- 3. ĐỐI TƯỢNG DOM ---
const mainImage = document.getElementById("mainImage");
const thumbnailList = document.getElementById("thumbnailList");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnPlayPause = document.getElementById("btnPlayPause");

const commandPalette = document.getElementById("commandPalette");
const paletteInput = document.getElementById("paletteInput");
const commandList = document.getElementById("commandList");
const btnPaletteTrigger = document.getElementById("btnPaletteTrigger");

// --- 4. KHỞI TẠO RENDER THUMBNAILS BAN ĐẦU ---
function initGallery() {
    images.forEach((img, idx) => {
        const btn = document.createElement("button");
        btn.className = "thumb-item";
        btn.setAttribute("role", "listitem");
        btn.setAttribute("aria-label", `Xem ảnh số ${img.id}: ${img.title}`);
        
        const innerImg = document.createElement("img");
        innerImg.src = img.url;
        innerImg.alt = img.title;
        
        btn.appendChild(innerImg);
        btn.addEventListener("click", () => changeImage(idx));
        thumbnailList.appendChild(btn);
    });
    changeImage(0);
}

// Hàm đổi ảnh chính
function changeImage(index) {
    // Đảm bảo chỉ số xoay vòng tuần hoàn hợp lệ
    if (index >= images.length) index = 0;
    if (index < 0) index = images.length - 1;
    
    currentIndex = index;
    const activeImg = images[currentIndex];
    
    // Cập nhật thẻ ảnh chính
    mainImage.src = activeImg.url;
    mainImage.alt = activeImg.title;
    
    // Cập nhật Class Active cho cụm Thumbnails
    const thumbs = thumbnailList.querySelectorAll(".thumb-item");
    thumbs.forEach((thumb, idx) => {
        if (idx === currentIndex) {
            thumb.classList.add("active");
            thumb.setAttribute("aria-current", "true");
        } else {
            thumb.classList.remove("active");
            thumb.removeAttribute("aria-current");
        }
    });
}

// --- 5. CHỨC NĂNG 1: QUẢN LÝ TỰ ĐỘNG CHẠY (SLIDESHOW) ---
function toggleSlideshow() {
    isPlaying = !isPlaying;
    if (isPlaying) {
        btnPlayPause.textContent = "⏸ Pause";
        slideshowInterval = setInterval(() => changeImage(currentIndex + 1), 3000);
    } else {
        btnPlayPause.textContent = "▶ Play";
        clearInterval(slideshowInterval);
    }
}

// --- 6. CHỨC NĂNG 2: ĐIỀU HƯỚNG BẰNG PHÍM TẮT TOÀN CỤC (KEYBOARD SHORTCUTS) ---
document.addEventListener("keydown", (e) => {
    // Nếu đang mở ô gõ lệnh Command Palette thì không chạy phím tắt Gallery bên ngoài
    if (commandPalette.classList.contains("open") && e.key !== "Escape") return;

    // A. Tổ hợp Ctrl + K: Mở Command Palette
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openCommandPalette();
        return;
    }

    // B. Xử lý các phím tắt điều hướng Gallery thông thường
    switch (e.key) {
        case "ArrowRight":
            e.preventDefault();
            changeImage(currentIndex + 1);
            break;
        case "ArrowLeft":
            e.preventDefault();
            changeImage(currentIndex - 1);
            break;
        case " ": // Phím Space
            e.preventDefault(); // Chặn cuộn trang mặc định của trình duyệt
            toggleSlideshow();
            break;
        case "Escape":
            if (commandPalette.classList.contains("open")) closeCommandPalette();
            break;
        default:
            // C. Nhấn số 1-9 nhảy nhanh đến ảnh tương ứng
            if (e.key >= "1" && e.key <= "9") {
                const targetIdx = parseInt(e.key) - 1;
                if (targetIdx < images.length) changeImage(targetIdx);
            }
            break;
    }
});

// Gắn sự kiện click trực tiếp cho 3 nút điều khiển giao diện
btnPrev.addEventListener("click", () => changeImage(currentIndex - 1));
btnNext.addEventListener("click", () => changeImage(currentIndex + 1));
btnPlayPause.addEventListener("click", toggleSlideshow);


// --- 7. CHỨC NĂNG 3: THANH LỆNH NHANH (COMMAND PALETTE OVERLAY) ---

function openCommandPalette() {
    lastFocusedElement = document.activeElement; // Lưu lại phần tử đang focus trước đó
    commandPalette.classList.add("open");
    commandPalette.setAttribute("aria-hidden", "false");
    paletteInput.value = "";
    renderCommandList(commands);
    paletteInput.focus(); // Ép focus dồn vào ô tìm kiếm ngay lập tức
}

function closeCommandPalette() {
    commandPalette.classList.remove("open");
    commandPalette.setAttribute("aria-hidden", "true");
    if (lastFocusedElement) lastFocusedElement.focus(); // Trả lại focus cho vị trí cũ
}

// Hàm vẽ danh sách lệnh dựa trên từ khóa bộ lọc
function renderCommandList(filteredCommands) {
    commandList.innerHTML = "";
    selectedCommandIndex = 0;

    if (filteredCommands.length === 0) {
        commandList.innerHTML = `<li style="color:#999; cursor:default;">Không tìm thấy lệnh nào phù hợp...</li>`;
        return;
    }

    filteredCommands.forEach((cmd, idx) => {
        const li = document.createElement("li");
        li.role = "option";
        li.id = `cmd-opt-${idx}`;
        if (idx === selectedCommandIndex) li.classList.add("selected");

        li.innerHTML = `<span>${cmd.text}</span><kbd>${cmd.key}</kbd>`;
        
        // Nhấp chuột cũng chạy lệnh
        li.addEventListener("click", () => executeCommand(cmd));
        commandList.appendChild(li);
    });
}

// Hàm thực thi lệnh sau khi bấm Enter hoặc click chọn
function executeCommand(cmd) {
    if (cmd.action === "next") changeImage(currentIndex + 1);
    else if (cmd.action === "prev") changeImage(currentIndex - 1);
    else if (cmd.action === "play") toggleSlideshow();
    else if (cmd.action.startsWith("goto-")) {
        const id = parseInt(cmd.action.split("-")[1]);
        changeImage(id - 1);
    }
    closeCommandPalette();
}

// Lọc lệnh Realtime khi gõ chữ vào input
paletteInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filtered = commands.filter(cmd => cmd.text.toLowerCase().includes(query));
    renderCommandList(filtered);
});

// Điều hướng cụm danh sách lệnh bằng phím ↑, ↓ và chốt chặn phím Enter, Esc
paletteInput.addEventListener("keydown", (e) => {
    const items = commandList.querySelectorAll("li[role='option']");
    const query = paletteInput.value.toLowerCase().trim();
    const currentFilteredList = commands.filter(cmd => cmd.text.toLowerCase().includes(query));

    if (items.length === 0) return;

    if (e.key === "ArrowDown") {
        e.preventDefault();
        items[selectedCommandIndex].classList.remove("selected");
        selectedCommandIndex = (selectedCommandIndex + 1) % items.length;
        items[selectedCommandIndex].classList.add("selected");
        items[selectedCommandIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        items[selectedCommandIndex].classList.remove("selected");
        selectedCommandIndex = (selectedCommandIndex - 1 + items.length) % items.length;
        items[selectedCommandIndex].classList.add("selected");
        items[selectedCommandIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
        e.preventDefault();
        if (currentFilteredList[selectedCommandIndex]) {
            executeCommand(currentFilteredList[selectedCommandIndex]);
        }
    } else if (e.key === "Escape") {
        closeCommandPalette();
    }
});

btnPaletteTrigger.addEventListener("click", openCommandPalette);

// --- 8. KHỞI CHẠY THƯ VIỆN ---
initGallery();