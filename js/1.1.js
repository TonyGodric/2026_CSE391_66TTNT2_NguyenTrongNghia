// Bước 1: Truy xuất các phần tử DOM
const inputStudentName = document.getElementById("inputStudentName");
const inputStudentScore = document.getElementById("inputStudentScore");
const btnAddStudent = document.getElementById("btnAddStudent");
const studentTableBody = document.getElementById("studentTableBody");


// Bước 2: Gắn sự kiện xoá cho các nút có sẵn
const existingDeleteButtons = studentTableBody.querySelectorAll(".btn-delete");

for (let i = 0; i < existingDeleteButtons.length; i++) {
    existingDeleteButtons[i].addEventListener("click", function () {

        const row = this.closest("tr");
        studentTableBody.removeChild(row);

        updateStudentOrder();
    });
}


// Bước 3: Thêm sinh viên
btnAddStudent.addEventListener("click", function () {

    const studentName = inputStudentName.value.trim();
    const studentScore = inputStudentScore.value.trim();

    if (!studentName || !studentScore) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    const score = parseFloat(studentScore);

    if (isNaN(score) || score < 0 || score > 10) {
        alert("Điểm phải là số từ 0 đến 10!");
        return;
    }


    // Xếp loại
    let rank = "";

    if (score >= 8.5) {
        rank = "Giỏi";
    } 
    else if (score >= 7) {
        rank = "Khá";
    } 
    else if (score >= 5) {
        rank = "Trung bình";
    } 
    else {
        rank = "Yếu";
    }


    // Tạo dòng mới
    const newRow = document.createElement("tr");

    // Điểm < 5 → thêm lớp để tô vàng
    // Dùng class thay inline style — nhất quán hơn
    if (score < 5) newRow.classList.add("low-score");

    // Tạo các ô
    const tdOrder = document.createElement("td");
    tdOrder.textContent = "";

    const tdName = document.createElement("td");
    tdName.textContent = studentName;

    const tdScore = document.createElement("td");
    tdScore.textContent = score;

    const tdRank = document.createElement("td");
    tdRank.textContent = rank;

    const tdAction = document.createElement("td");


    // Nút xoá
    const deleteButton = document.createElement("button");
    deleteButton.className = "btn-delete";
    deleteButton.textContent = "Xoá";

    deleteButton.addEventListener("click", function () {
        const row = this.closest("tr");
        studentTableBody.removeChild(row);
        updateStudentOrder();
        updateStatistics();
    });


    tdAction.appendChild(deleteButton);


    // Ghép vào tr
    newRow.appendChild(tdOrder);
    newRow.appendChild(tdName);
    newRow.appendChild(tdScore);
    newRow.appendChild(tdRank);
    newRow.appendChild(tdAction);

    studentTableBody.appendChild(newRow);


    // reset input
    inputStudentName.value = "";
    inputStudentScore.value = "";
    inputStudentName.focus();

    updateStudentOrder();
});


// Bước 4: Cập nhật STT


    const allRows = studentTableBody.querySelectorAll("tr");

    for (let i = 0; i < allRows.length; i++) {
        allRows[i].cells[0].textContent = i + 1;
    }

// Bước 5 : Bên dưới bảng hiển thị thống kê Tổng sinh viên và  điểm trung bình cả lớp 
function updateStatistics() {

    const allRows = studentTableBody.querySelectorAll("tr");
    const totalStudents = allRows.length;
    let totalScore = 0;

    for (let i = 0; i < allRows.length; i++) {
        const score = parseFloat(allRows[i].cells[2].textContent);
        if (!isNaN(score)) {
            totalScore += score;
        }
    }

    const averageScore = totalStudents > 0 ? (totalScore / totalStudents).toFixed(2) : 0;

    document.getElementById("totalStudents").textContent = totalStudents;
    document.getElementById("averageScore").textContent = averageScore;
}


// Bước 6 : Cập nhập
function updateStudentOrder() {
    const allRows = studentTableBody.querySelectorAll("tr");
    for (let i = 0; i < allRows.length; i++) {
        allRows[i].cells[0].textContent = i + 1;
    }
    updateStatistics();
}
// Bước 7 : Nhấn Enter để thêm thay vì phải click
inputStudentScore.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        btnAddStudent.click();
    }});