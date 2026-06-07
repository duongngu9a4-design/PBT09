// --- 1. KHỞI TẠO DANH SÁCH 12 SẢN PHẨM (4 CATEGORIES) ---
const products = [
    { id: 1, name: "iPhone 16 Pro Max", price: 34990000, category: "phone", image: "https://placehold.co/200x200/2563eb/white?text=iPhone+16", rating: 4.8, inStock: true },
    { id: 2, name: "Samsung Galaxy S24 Ultra", price: 29990000, category: "phone", image: "https://placehold.co/200x200/0284c7/white?text=S24+Ultra", rating: 4.7, inStock: true },
    { id: 3, name: "Google Pixel 9 Pro", price: 24500000, category: "phone", image: "https://placehold.co/200x200/4f46e5/white?text=Pixel+9", rating: 4.6, inStock: false },
    { id: 4, name: "MacBook Pro M3", price: 39990000, category: "laptop", image: "https://placehold.co/200x200/4b5563/white?text=MacBook+M3", rating: 4.9, inStock: true },
    { id: 5, name: "Dell XPS 14 2024", price: 36500000, category: "laptop", image: "https://placehold.co/200x200/0369a1/white?text=Dell+XPS", rating: 4.4, inStock: true },
    { id: 6, name: "ASUS ROG Zephyrus G14", price: 42990000, category: "laptop", image: "https://placehold.co/200x200/b91c1c/white?text=ROG+G14", rating: 4.7, inStock: true },
    { id: 7, name: "iPad Pro M4", price: 28990000, category: "tablet", image: "https://placehold.co/200x200/0d9488/white?text=iPad+Pro", rating: 4.8, inStock: true },
    { id: 8, name: "Samsung Galaxy Tab S9", price: 18490000, category: "tablet", image: "https://placehold.co/200x200/0891b2/white?text=Tab+S9", rating: 4.3, inStock: true },
    { id: 9, name: "Xiaomi Pad 6 Pro", price: 9290000, category: "tablet", image: "https://placehold.co/200x200/ea580c/white?text=Pad+6+Pro", rating: 4.5, inStock: false },
    { id: 10, name: "AirPods Pro Gen 2", price: 5990000, category: "accessory", image: "https://placehold.co/200x200/16a34a/white?text=AirPods+Pro", rating: 4.6, inStock: true },
    { id: 11, name: "Sony WH-1000XM5", price: 7490000, category: "accessory", image: "https://placehold.co/200x200/52525b/white?text=Sony+XM5", rating: 4.7, inStock: true },
    { id: 12, name: "Keychron K2 V2", price: 1950000, category: "accessory", image: "https://placehold.co/200x200/7c3aed/white?text=Keychron", rating: 4.2, inStock: true }
]; 

// --- 2. QUẢN LÝ TRẠNG THÁI (STATE MANAGEMENT) ---
let cartCount = 0;
let activeCategory = "all";
let searchQuery = "";
let currentSort = "default";

// --- 3. DỰNG KHUNG GIAO DIỆN (BUILD INITIAL DOM TREE) ---
const root = document.getElementById("root");

// Khởi tạo các Node chính
const header = document.createElement("header");
header.innerHTML = `<h1>Tech Catalog</h1><div class="cart-icon">🛒<span class="cart-badge" id="cartBadge">0</span></div>`;

const controlsBar = document.createElement("controls-bar");
controlsBar.className = "controls-bar";

// Input Search
const searchInput = document.createElement("input");
searchInput.type = "text";
searchInput.className = "search-input";
searchInput.placeholder = "Tìm kiếm sản phẩm...";

// Select Sort
const sortSelect = document.createElement("select");
sortSelect.className = "sort-select";
sortSelect.innerHTML = `
    <option value="default">Sắp xếp: Mặc định</option>
    <option value="price-asc">Giá: Thấp đến Cao</option>
    <option value="price-desc">Giá: Cao đến Thấp</option>
    <option value="name-asc">Tên: A - Z</option>
    <option value="rating-desc">Đánh giá cao nhất</option>
`;

// Dark Mode Button
const toggleModeBtn = document.createElement("button");
toggleModeBtn.className = "toggle-mode-btn";
toggleModeBtn.textContent = "🌙 Dark Mode";

// Khối Category Buttons
const categories = ["all", "phone", "laptop", "tablet", "accessory"];
const categoryGroup = document.createElement("div");
categoryGroup.className = "category-group";

categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = `filter-btn ${cat === "all" ? "active" : ""}`;
    btn.textContent = cat.toUpperCase();
    btn.dataset.category = cat;
    categoryGroup.appendChild(btn);
});

// Grid hiển thị danh sách
const productsGrid = document.createElement("div");
productsGrid.className = "products-grid";

// Ráp nối cây DOM thô vào màn hình
controlsBar.append(searchInput, sortSelect, categoryGroup, toggleModeBtn);
root.append(header, controlsBar, productsGrid);


// --- 4. CÁC HÀM XỬ LÝ NGHIỆP VỤ (CORE LOGIC FUNCTIONS) ---

// Hàm 4.1: Thực hiện sắp xếp mảng dữ liệu
function sortProducts(arr) {
    const sorted = [...arr];
    if (currentSort === "price-asc") return sorted.sort((a, b) => a.price - b.price);
    if (currentSort === "price-desc") return sorted.sort((a, b) => b.price - a.price);
    if (currentSort === "name-asc") return sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (currentSort === "rating-desc") return sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
}

// Hàm 4.2: Lọc tổng hợp (Combine Filter & Search & Sort) rồi vẽ ra DOM
function filterAndRender() {
    // Bước 1: Lọc theo Category
    let result = products.filter(p => activeCategory === "all" || p.category === activeCategory);
    
    // Bước 2: Lọc theo Từ khóa tìm kiếm
    if (searchQuery) {
        result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    // Bước 3: Áp dụng Sắp xếp
    result = sortProducts(result);
    
    // Bước 4: Gọi hàm vẽ
    renderProducts(result);
}

// Hàm 4.3: Vẽ các thẻ Card sản phẩm
function renderProducts(items) {
    productsGrid.innerHTML = ""; // Xóa các card cũ
    
    if (items.length === 0) {
        productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 40px; color:#999;">Không tìm thấy sản phẩm phù hợp.</p>`;
        return;
    }

    items.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        
        const img = document.createElement("img");
        img.className = "product-img";
        img.src = product.image;
        img.alt = product.name;

        const title = document.createElement("h3");
        title.className = "product-title";
        title.textContent = product.name;

        const price = document.createElement("p");
        price.className = "product-price";
        price.textContent = product.price.toLocaleString("vi-VN") + "đ";

        const meta = document.createElement("p");
        meta.className = "product-meta";
        meta.textContent = `⭐ ${product.rating} | ${product.inStock ? "Còn hàng" : "Hết hàng"}`;

        const addBtn = document.createElement("button");
        addBtn.className = "add-btn";
        addBtn.textContent = product.inStock ? "Thêm vào giỏ" : "Tạm hết hàng";
        addBtn.disabled = !product.inStock;

        // Xử lý Sự kiện Thêm vào Giỏ hàng
        addBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Ngăn chặn sự kiện click lan truyền ra lớp Card gây mở Modal
            cartCount++;
            document.getElementById("cartBadge").textContent = cartCount;
        });

        // Xử lý Sự kiện mở Modal xem chi tiết khi click vào Card
        card.addEventListener("click", () => openModal(product));

        card.append(img, title, price, meta, addBtn);
        productsGrid.appendChild(card);
    });
}

// Hàm 4.4: Tạo và hiển thị Modal chi tiết sản phẩm bằng JS thuần
function openModal(product) {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    const content = document.createElement("div");
    content.className = "modal-content";

    content.innerHTML = `
        <button class="close-modal">&times;</button>
        <img src="${product.image}" style="width:150px; height:150px; border-radius:8px; margin-bottom:15px;">
        <h2>${product.name}</h2>
        <p style="color:var(--accent-color); font-weight:bold; margin: 10px 0;">Giá: ${product.price.toLocaleString("vi-VN")}đ</p>
        <p style="margin-bottom:8px;">Danh mục: ${product.category.toUpperCase()}</p>
        <p style="margin-bottom:15px;">Đánh giá: ⭐ ${product.rating}/5.0</p>
        <p style="font-size:14px; color:#666;">Đây là mô tả chi tiết mẫu của sản phẩm được khởi tạo hoàn toàn bằng cấu trúc DOM bất đồng bộ của JavaScript.</p>
    `;

    overlay.appendChild(content);
    root.appendChild(overlay);

    // Đóng Modal khi bấm nút X hoặc bấm lệch ra vùng overlay đen
    const closeModal = () => overlay.remove();
    content.querySelector(".close-modal").addEventListener("click", closeModal);
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal();
    });
}


// --- 5. ĐĂNG KÝ BẮT SỰ KIỆN (EVENT LISTENERS) ---

// Realtime Search (Sử dụng sự kiện input)
searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    filterAndRender();
});

// Sort Dropdown Change
sortSelect.addEventListener("change", (e) => {
    currentSort = e.target.value;
    filterAndRender();
});

// Category Filter (Sử dụng Event Delegation trên cụm nút nhóm danh mục)
categoryGroup.addEventListener("click", (e) => {
    if (e.target.classList.contains("filter-btn")) {
        // Cập nhật trạng thái Active trên giao diện nút
        categoryGroup.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
        e.target.classList.add("active");

        // Thay đổi biến trạng thái và kích hoạt lọc lại toàn cục
        activeCategory = e.target.dataset.category;
        filterAndRender();
    }
});

// Toggle Dark/Light Mode
toggleModeBtn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    toggleModeBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    toggleModeBtn.style.background = isDark ? "#ffffff" : "";
    toggleModeBtn.style.color = isDark ? "#111827" : "";
});


// --- 6. KHỞI CHẠY KHỞI TẠO ĐẦU TRANG ---
filterAndRender();