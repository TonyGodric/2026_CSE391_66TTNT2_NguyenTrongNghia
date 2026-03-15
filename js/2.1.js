function showError(fieldId, message) {
    const errorSpan = document.getElementById('error-' + fieldId);
    errorSpan.textContent = message;
    errorSpan.style.display = 'block';
    document.getElementById(fieldId).classList.add('is-invalid');
    document.getElementById(fieldId).classList.remove('is-valid');
}

function clearError(fieldId) {
    const errorSpan = document.getElementById('error-' + fieldId);
    errorSpan.style.display = 'none';
    document.getElementById(fieldId).classList.remove('is-invalid');
    document.getElementById(fieldId).classList.add('is-valid');
}

function validateFullname() {
    const fullname = document.getElementById("validationServer01").value.trim();
    if (fullname === '') {
        showError('validationServer01', 'Họ và tên không được để trống.');
        return false;
    }
    if (fullname.length < 3) {
        showError('validationServer01', 'Họ và tên phải có ít nhất 3 ký tự.');
        return false;
    }
    const regex = /^[a-zA-ZÀ-ỹ\s]+$/;
    if (!regex.test(fullname)) {
        showError('validationServer01', 'Họ và tên chỉ chứa chữ cái và khoảng trắng.');
        return false;
    }
    clearError('validationServer01');
    return true;
}

function validateEmail() {
    const email = document.getElementById("validationServer02").value.trim();
    if (email === '') {
        showError('validationServer02', 'Email không được để trống.');
        return false;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        showError('validationServer02', 'Email không đúng định dạng.');
        return false;
    }
    clearError('validationServer02');
    return true;
}

function validatePhone() {
    const phone = document.getElementById("validationServerUsername").value.trim();
    if (phone === '') {
        showError('validationServerUsername', 'Số điện thoại không được để trống.');
        return false;
    }
    const regex = /^0[0-9]{9}$/;
    if (!regex.test(phone)) {
        showError('validationServerUsername', 'Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số.');
        return false;
    }
    clearError('validationServerUsername');
    return true;
}

function validatePassword() {
    const password = document.getElementById("validationServer03").value;
    if (password === '') {
        showError('validationServer03', 'Mật khẩu không được để trống.');
        return false;
    }
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!regex.test(password)) {
        showError('validationServer03', 'Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số.');
        return false;
    }
    clearError('validationServer03');
    return true;
}

function validateConfirmPassword() {
    const password = document.getElementById("validationServer03").value;
    const confirmPassword = document.getElementById("validationServer04").value;
    if (confirmPassword === '') {
        showError('validationServer04', 'Xác nhận mật khẩu không được để trống.');
        return false;
    }
    if (password !== confirmPassword) {
        showError('validationServer04', 'Mật khẩu xác nhận không khớp.');
        return false;
    }
    clearError('validationServer04');
    return true;
}

function validateGender() {
    const male = document.getElementById("male").checked;
    const female = document.getElementById("female").checked;
    if (!male && !female) {
        showError('gender', 'Vui lòng chọn giới tính.');
        return false;
    }
    clearError('gender');
    return true;
}

function validateTerms() {
    const terms = document.getElementById("invalidCheck3").checked;
    if (!terms) {
        showError('invalidCheck3', 'Bạn phải đồng ý với điều khoản.');
        return false;
    }
    clearError('invalidCheck3');
    return true;
}

// Event listeners
document.getElementById("validationServer01").addEventListener('blur', validateFullname);
document.getElementById("validationServer01").addEventListener('input', () => clearError('validationServer01'));

document.getElementById("validationServer02").addEventListener('blur', validateEmail);
document.getElementById("validationServer02").addEventListener('input', () => clearError('validationServer02'));

document.getElementById("validationServerUsername").addEventListener('blur', validatePhone);
document.getElementById("validationServerUsername").addEventListener('input', () => clearError('validationServerUsername'));

document.getElementById("validationServer03").addEventListener('blur', validatePassword);
document.getElementById("validationServer03").addEventListener('input', () => clearError('validationServer03'));

document.getElementById("validationServer04").addEventListener('blur', validateConfirmPassword);
document.getElementById("validationServer04").addEventListener('input', () => clearError('validationServer04'));

document.getElementById("male").addEventListener('change', validateGender);
document.getElementById("female").addEventListener('change', validateGender);

document.getElementById("invalidCheck3").addEventListener('change', validateTerms);

// Submit handler
document.getElementById("registrationForm").addEventListener('submit', function(event) {
    event.preventDefault();
    const isValid = validateFullname() & validateEmail() & validatePhone() & validatePassword() & validateConfirmPassword() & validateGender() & validateTerms();
    if (isValid) {
        const fullname = document.getElementById("validationServer01").value.trim();
        document.getElementById("userName").textContent = fullname;
        document.getElementById("successMessage").style.display = 'block';
        document.getElementById("registrationForm").style.display = 'none';
    }
});
//Nâng cấp form Bài 2.1 với các tính năng sau:

//- **Thanh mức độ mạnh mật khẩu (Password Strength Bar)**: Hiển thị realtime mức độ: Yếu (đỏ) / Trung bình (vàng) / Mạnh (xanh) dựa trên độ dài và độ phức tạp.
//- **Hiển thị/ẩn mật khẩu**: Nút toggle 👁 bên cạnh ô mật khẩu để chuyển đổi `type="password"` ↔ `type="text"`.
//- **Đếm ký tự họ tên**: Hiển thị số ký tự đang nhập / tối đa 50 (VD: `12/50`).
function checkStrength(password) {
    let score = 0;
    if (password.length >= 8)           score++;
    if (/[A-Z]/.test(password))         score++;
    if (/[0-9]/.test(password))         score++;
    if (/[^A-Za-z0-9]/.test(password))  score++;

    const fill = document.getElementById("strengthFill");
    const text = document.getElementById("strengthText");

    const levels = [
        { label: "",           color: "",        width: "0%"   },
        { label: "Yếu",        color: "#e02424", width: "25%"  },
        { label: "Trung bình", color: "#f59e0b", width: "50%"  },
        { label: "Khá mạnh",   color: "#3b82f6", width: "75%"  },
        { label: "Mạnh",       color: "#057a55", width: "100%" },
    ];

    fill.style.width           = levels[score].width;
    fill.style.backgroundColor = levels[score].color;
    text.textContent           = levels[score].label;
    text.style.color           = levels[score].color;
}

document.getElementById("validationServer03").addEventListener("input", function () {
    checkStrength(this.value);
});
document.getElementById("validationServer01").addEventListener("input", function () {
    const len = this.value.length;
    const counter = document.getElementById("nameCounter");
    counter.textContent = len + "/50";
    counter.style.color = len >= 50 ? "#e02424" : "#6b7280";
});