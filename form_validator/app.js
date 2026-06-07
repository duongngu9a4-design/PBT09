// --- ĐỐI TƯỢNG ĐIỀU KHIỂN DOM ---
const form = document.getElementById("registerForm");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const phone = document.getElementById("phone");
const submitBtn = document.getElementById("submitBtn");

const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

const successModal = document.getElementById("successModal");
const modalData = document.getElementById("modalData");
const closeModal = document.getElementById("closeModal");

// Trạng thái hợp lệ tổng thể của các trường
const fieldsState = {
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    phone: false
};

// --- CÁC HÀM TRỢ GIÚP GIAO DIỆN (UI HELPERS) ---
function setValid(inputEl, isValid, errorText = "") {
    const group = inputEl.closest(".form-group");
    const icon = group.querySelector(".status-icon");
    const error = group.querySelector(".error-msg");
    const fieldId = inputEl.id;

    fieldsState[fieldId] = isValid;

    if (isValid) {
        inputEl.style.borderColor = "#16a34a";
        icon.textContent = "✅";
        error.textContent = "";
    } else {
        // Chỉ đổi sang viền đỏ nếu người dùng đã nhập ít nhất 1 ký tự
        inputEl.style.borderColor = inputEl.value.length > 0 ? "#dc2626" : "#ccc";
        icon.textContent = inputEl.value.length > 0 ? "❌" : "";
        error.textContent = errorText;
    }
    
    checkFormValidity();
}

// Kiểm tra toàn cục xem nút Submit có được kích hoạt hay không
function checkFormValidity() {
    const allValid = Object.values(fieldsState).every(state => state === true);
    submitBtn.disabled = !allValid;
}

// --- LOGIC VALIDATION CHI TIẾT ---

// 1. Validate Tên (2 - 50 ký tự)
username.addEventListener("input", () => {
    const val = username.value.trim();
    if (val.length >= 2 && val.length <= 50) {
        setValid(username, true);
    } else {
        setValid(username, false, "Tên phải chứa từ 2 đến 50 ký tự.");
    }
});

// 2. Validate Email (Sử dụng Regex)
email.addEventListener("input", () => {
    const val = email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailRegex.test(val)) {
        setValid(email, true);
    } else {
        setValid(email, false, "Định dạng Email không hợp lệ (ví dụ: name@abc.com).");
    }
});

// 3. Password Strength Meter
password.addEventListener("input", () => {
    const val = password.value;
    
    // Đặt lại các class màu cũ
    strengthBar.className = "strength-bar";
    strengthText.className = "strength-text";

    if (val.length === 0) {
        strengthBar.style.width = "0%";
        strengthText.textContent = "";
        setValid(password, false, "");
        return;
    }

    // Các điều kiện kiểm tra regex
    const hasLetter = /[a-zA-Z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    const hasUpper = /[A-Z]/.test(val);
    const hasLower = /[a-z]/.test(val);
    const hasSpecial = /[^a-zA-Z0-9]/.test(val);

    let strength = "weak";
    
    if (val.length >= 8) {
        if (hasUpper && hasLower && hasNumber && hasSpecial) {
            strength = "strong";
        } else if (hasLetter && hasNumber) {
            strength = "medium";
        }
    }

    // Hiển thị giao diện thước đo theo mức độ nhận diện
    if (strength === "weak") {
        strengthBar.style.width = "33%";
        strengthBar.classList.add("strength-weak");
        strengthText.classList.add("strength-weak");
        strengthText.textContent = "Độ bảo mật: Yếu (Cần ít nhất 8 ký tự)";
        setValid(password, false, "Mật khẩu quá yếu.");
    } else if (strength === "medium") {
        strengthBar.style.width = "66%";
        strengthBar.classList.add("strength-medium");
        strengthText.classList.add("strength-medium");
        strengthText.textContent = "Độ bảo mật: Trung bình (Thêm chữ hoa và ký tự đặc biệt để tối ưu)";
        setValid(password, true);
    } else if (strength === "strong") {
        strengthBar.style.width = "100%";
        strengthBar.classList.add("strength-strong");
        strengthText.classList.add("strength-strong");
        strengthText.textContent = "Độ bảo mật: Mạnh 💪";
        setValid(password, true);
    }

    // Trigger kiểm tra lại xác nhận mật khẩu nếu ô confirmPassword đã có chữ
    if (confirmPassword.value.length > 0) {
        confirmPassword.dispatchEvent(new Event("input"));
    }
});

// 4. Real-time Check Khớp Mật Khẩu
confirmPassword.addEventListener("input", () => {
    if (confirmPassword.value === password.value && confirmPassword.value.length > 0) {
        setValid(confirmPassword, true);
    } else {
        setValid(confirmPassword, false, "Mật khẩu xác nhận không trùng khớp.");
    }
});

// 5. Định dạng Tự Động Thêm Dấu Gạch Ngang Số Điện Thoại (0901-234-567)
phone.addEventListener("input", (e) => {
    // Chỉ lấy các ký tự số, loại bỏ hoàn toàn các ký tự khác
    let rawVal = e.target.value.replace(/\D/g, "");
    
    // Cắt chuỗi xử lý nếu người dùng cố tình dán (paste) chuỗi quá 10 số
    if (rawVal.length > 10) rawVal = rawVal.substring(0, 10);
    
    let formattedVal = "";
    
    // Tiến hành chèn ký tự '-' dựa trên độ dài chuỗi số thực tế đang gõ
    if (rawVal.length <= 4) {
        formattedVal = rawVal;
    } else if (rawVal.length <= 7) {
        formattedVal = `${rawVal.slice(0, 4)}-${rawVal.slice(4)}`;
    } else {
        formattedVal = `${rawVal.slice(0, 4)}-${rawVal.slice(4, 7)}-${rawVal.slice(7)}`;
    }
    
    // Gán lại giá trị đã định dạng vào input
    e.target.value = formattedVal;

    // Validate kiểm tra độ dài (đủ 10 số, tương đương 12 ký tự bao gồm 2 dấu gạch)
    if (rawVal.length === 10) {
        setValid(phone, true);
    } else {
        setValid(phone, false, "Số điện thoại phải bao gồm đủ 10 chữ số.");
    }
});

// --- 6. XỬ LÝ SỰ KIỆN SUBMIT FORM VÀ MODAL POPUP ---
form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Kiểm tra chốt chặn cuối cùng
    const allValid = Object.values(fieldsState).every(state => state === true);
    if (!allValid) return;

    // Trích xuất thông tin hiển thị lên Modal thành công
    modalData.innerHTML = `
        <strong>Họ tên:</strong> ${username.value.trim()}<br>
        <strong>Email:</strong> ${email.value.trim()}<br>
        <strong>Số điện thoại:</strong> ${phone.value}
    `;
    
    successModal.classList.add("open");
});

// Đóng modal, đồng thời reset sạch form đăng ký
closeModal.addEventListener("click", () => {
    successModal.classList.remove("open");
    form.reset();
    
    // Xóa sạch trạng thái UI, đặt lại icon và thanh progress bar về ban đầu
    document.querySelectorAll(".status-icon").forEach(icon => icon.textContent = "");
    document.querySelectorAll("input").forEach(input => input.style.borderColor = "#ccc");
    strengthBar.style.width = "0%";
    strengthText.textContent = "";
    
    // Reset object trạng thái
    Object.keys(fieldsState).forEach(key => fieldsState[key] = false);
    checkFormValidity();
});