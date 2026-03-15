let currentStep = 1;

// ham hien loi
function showError(id, msg) {
    document.getElementById("error-" + id).textContent = "⚠ " + msg;
    document.getElementById("error-" + id).style.display = "block";
    document.getElementById(id).classList.add("is-invalid");
    document.getElementById(id).classList.remove("is-valid");
}

// ham an loi va hien is-valid
function clearError(id) {
    document.getElementById("error-" + id).style.display = "none";
    document.getElementById(id).classList.remove("is-invalid");
    document.getElementById(id).classList.add("is-valid");
}

// ham chi an loi thoi, khong hien is-valid
function clearErrorOnly(id) {
    document.getElementById("error-" + id).style.display = "none";
    document.getElementById(id).classList.remove("is-invalid");
}

// kiem tra buoc 1
function validateStep1() {
    let isValid = true;

    let name = document.getElementById("fullName").value.trim();
    if (name == "") {
        showError("fullName", "Vui lòng nhập họ và tên.");
        isValid = false;
    } else if (name.length < 2) {
        showError("fullName", "Họ tên phải ít nhất 2 ký tự.");
        isValid = false;
    } else {
        clearError("fullName");
    }

    let birth = document.getElementById("birthDate").value;
    if (birth == "") {
        showError("birthDate", "Vui lòng chọn ngày sinh.");
        isValid = false;
    } else {
        let birthDate = new Date(birth);
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        // tinh tuoi
        let age = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
        if (birthDate > today) {
            showError("birthDate", "Ngày sinh không được là tương lai.");
            isValid = false;
        } else if (age < 10) {
            showError("birthDate", "Bạn phải ít nhất 10 tuổi.");
            isValid = false;
        } else {
            clearError("birthDate");
        }
    }

    let gender = document.getElementById("gender").value;
    if (gender == "") {
        showError("gender", "Vui lòng chọn giới tính.");
        isValid = false;
    } else {
        clearError("gender");
    }

    return isValid;
}

// kiem tra buoc 2
function validateStep2() {
    let isValid = true;

    let email = document.getElementById("email").value.trim();
    // regex kiem tra email don gian
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email == "") {
        showError("email", "Vui lòng nhập email.");
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showError("email", "Email không hợp lệ.");
        isValid = false;
    } else {
        clearError("email");
    }

    let password = document.getElementById("password").value;
    if (password == "") {
        showError("password", "Vui lòng nhập mật khẩu.");
        isValid = false;
    } else if (password.length < 8) {
        showError("password", "Mật khẩu phải ít nhất 8 ký tự.");
        isValid = false;
    } else {
        clearError("password");
    }

    let confirmPassword = document.getElementById("confirmPassword").value;
    if (confirmPassword == "") {
        showError("confirmPassword", "Vui lòng xác nhận mật khẩu.");
        isValid = false;
    } else if (confirmPassword != password) {
        showError("confirmPassword", "Mật khẩu xác nhận không khớp.");
        isValid = false;
    } else {
        clearError("confirmPassword");
    }

    return isValid;
}

// cap nhat progress bar
function updateProgress(step) {
    for (let i = 1; i <= 3; i++) {
        let indicator = document.getElementById("step-indicator-" + i);
        indicator.classList.remove("active", "done");

        if (i < step) {
            indicator.classList.add("done");
        } else if (i == step) {
            indicator.classList.add("active");
        }
    }

    for (let i = 1; i <= 2; i++) {
        let line = document.getElementById("line-" + i);
        if (i < step) {
            line.classList.add("done");
        } else {
            line.classList.remove("done");
        }
    }
}

// chuyen buoc
function goToStep(step) {
    document.getElementById("step" + currentStep).style.display = "none";
    currentStep = step;
    document.getElementById("step" + currentStep).style.display = "block";
    updateProgress(currentStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// dien thong tin vao buoc xac nhan
function fillSummary() {
    let name = document.getElementById("fullName").value.trim();
    let birth = document.getElementById("birthDate").value;
    let gender = document.getElementById("gender").value;
    let email = document.getElementById("email").value.trim();

    document.getElementById("sum-name").textContent = name;
    document.getElementById("sum-birth").textContent = new Date(birth).toLocaleDateString("vi-VN");
    document.getElementById("sum-gender").textContent = gender;
    document.getElementById("sum-email").textContent = email;
}

// kiem tra do manh mat khau
function checkStrength(password) {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let fill = document.getElementById("strengthFill");
    let text = document.getElementById("strengthText");

    if (score == 0) {
        fill.style.width = "0%";
        fill.style.backgroundColor = "";
        text.textContent = "";
        text.style.color = "";
    } else if (score == 1) {
        fill.style.width = "25%";
        fill.style.backgroundColor = "#e02424";
        text.textContent = "Yếu";
        text.style.color = "#e02424";
    } else if (score == 2) {
        fill.style.width = "50%";
        fill.style.backgroundColor = "#f59e0b";
        text.textContent = "Trung bình";
        text.style.color = "#f59e0b";
    } else if (score == 3) {
        fill.style.width = "75%";
        fill.style.backgroundColor = "#3b82f6";
        text.textContent = "Khá mạnh";
        text.style.color = "#3b82f6";
    } else if (score == 4) {
        fill.style.width = "100%";
        fill.style.backgroundColor = "#057a55";
        text.textContent = "Mạnh";
        text.style.color = "#057a55";
    }
}

// dem ky tu ho ten
document.getElementById("fullName").addEventListener("input", function() {
    let len = this.value.length;
    let counter = document.getElementById("nameCounter");
    counter.textContent = len + "/50";

    if (len >= 50) {
        counter.style.color = "#e02424";
    } else {
        counter.style.color = "#6b7280";
    }

    if (len > 0) {
        clearErrorOnly("fullName");
    }
});

// strength bar cho mat khau
document.getElementById("password").addEventListener("input", function() {
    checkStrength(this.value);
});

// validate khi roi khoi o input buoc 1
document.getElementById("fullName").addEventListener("blur", function() {
    validateStep1();
});

document.getElementById("birthDate").addEventListener("blur", function() {
    validateStep1();
});

document.getElementById("gender").addEventListener("change", function() {
    validateStep1();
});

// validate khi roi khoi o input buoc 2
document.getElementById("email").addEventListener("blur", function() {
    validateStep2();
});

document.getElementById("password").addEventListener("blur", function() {
    validateStep2();
});

document.getElementById("confirmPassword").addEventListener("blur", function() {
    validateStep2();
});

// nut tiep theo buoc 1
document.getElementById("nextBtn1").addEventListener("click", function() {
    let valid = validateStep1();
    if (valid == true) {
        goToStep(2);
    }
});

// nut tiep theo buoc 2
document.getElementById("nextBtn2").addEventListener("click", function() {
    let valid = validateStep2();
    if (valid == true) {
        fillSummary();
        goToStep(3);
    }
});

// nut quay lai
document.getElementById("backBtn2").addEventListener("click", function() {
    goToStep(1);
});

document.getElementById("backBtn3").addEventListener("click", function() {
    goToStep(2);
});

// nut hoan tat
document.getElementById("submitBtn").addEventListener("click", function() {
    document.getElementById("step3").style.display = "none";
    document.getElementById("successMessage").style.display = "block";
    document.getElementById("sum-name-success").textContent = document.getElementById("fullName").value.trim();
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// chay progress bar lan dau
updateProgress(1);