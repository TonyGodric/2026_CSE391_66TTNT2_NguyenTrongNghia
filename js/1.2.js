// ================================================================
//  app.js – Quản lý sinh viên (Lab 4)
//  Toàn bộ style dùng Bootstrap 5 utility / component classes.
//  Muốn đổi màu / kiểu → sửa các hằng BADGE_CLASS / LOW_SCORE_CLASS.
// ================================================================

// ── CẤU HÌNH (sửa ở đây nếu muốn đổi style) ─────────────────────

/** Class Bootstrap cho badge từng xếp loại */
const BADGE_CLASS = {
    "Giỏi":       "badge text-bg-primary",
    "Khá":        "badge text-bg-success",
    "Trung bình": "badge text-bg-warning",
    "Yếu":        "badge text-bg-danger",
};

/** Class thêm vào <tr> khi điểm < 5 */
const LOW_SCORE_CLASS = "table-warning-row";   // định nghĩa trong <style>

/** Ký hiệu mũi tên sắp xếp */
const SORT_ICON = { asc: " ▲", desc: " ▼", none: "" };

// ── DOM REFERENCES ────────────────────────────────────────────────

const inputName    = document.getElementById("inputStudentName");
const inputScore   = document.getElementById("inputStudentScore");
const btnAdd       = document.getElementById("btnAddStudent");
const tbody        = document.getElementById("studentTableBody");
const searchInput  = document.getElementById("searchInput");
const selectRank   = document.getElementById("selectRankFilter");
const scoreHeader  = document.getElementById("scoreHeader");
const elTotal      = document.getElementById("totalStudents");
const elAverage    = document.getElementById("averageScore");

// ── STATE ─────────────────────────────────────────────────────────

let students      = [];          // mảng gốc, không bao giờ bị lọc
let sortDirection = "none";      // "none" | "asc" | "desc"
let nextId        = 1;

// ── HELPERS ───────────────────────────────────────────────────────

function getRank(score) {
    if (score >= 8.5) return "Giỏi";
    if (score >= 7)   return "Khá";
    if (score >= 5)   return "Trung bình";
    return "Yếu";
}

function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/** Highlight viền đỏ input khi validate thất bại */
function markInvalid(el) {
    el.classList.add("is-invalid");
    el.addEventListener("input", () => el.classList.remove("is-invalid"), { once: true });
}

// ── RENDER ────────────────────────────────────────────────────────

function applyFilters() {
    const keyword = searchInput.value.trim().toLowerCase();
    const rank    = selectRank.value;

    let result = students.filter(s => {
        const matchName = s.name.toLowerCase().includes(keyword);
        const matchRank = !rank || s.rank === rank;
        return matchName && matchRank;
    });

    if (sortDirection === "asc")  result.sort((a, b) => a.score - b.score);
    if (sortDirection === "desc") result.sort((a, b) => b.score - a.score);

    renderTable(result);
    updateStatistics();
}

function renderTable(list) {
    tbody.innerHTML = "";

    if (list.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-secondary py-4">
                    <i class="bi bi-inbox me-2"></i>Không có kết quả
                </td>
            </tr>`;
        return;
    }

    list.forEach((s, index) => {
        const tr = document.createElement("tr");
        if (s.score < 5) tr.classList.add(LOW_SCORE_CLASS);

        tr.innerHTML = `
            <td class="text-secondary">${index + 1}</td>
            <td>${escapeHtml(s.name)}</td>
            <td class="fw-bold">${s.score}</td>
            <td><span class="${BADGE_CLASS[s.rank]}">${s.rank}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${s.id}">
                    <i class="bi bi-trash3"></i>
                </button>
            </td>`;
        tbody.appendChild(tr);
    });
}

function updateStatistics() {
    const total = students.length;
    const avg   = total > 0
        ? (students.reduce((sum, s) => sum + s.score, 0) / total).toFixed(2)
        : 0;
    elTotal.textContent   = total;
    elAverage.textContent = avg;
}

// ── ADD ───────────────────────────────────────────────────────────

function addStudent() {
    const name = inputName.value.trim();
    const raw  = inputScore.value.trim();
    let valid  = true;

    if (!name) { markInvalid(inputName); valid = false; }

    const score = parseFloat(raw);
    if (!raw || isNaN(score) || score < 0 || score > 10) {
        markInvalid(inputScore); valid = false;
    }

    if (!valid) return;

    students.push({ id: nextId++, name, score, rank: getRank(score) });

    inputName.value  = "";
    inputScore.value = "";
    inputName.focus();

    applyFilters();
}

// ── DELETE (Event Delegation) ─────────────────────────────────────

tbody.addEventListener("click", function (e) {
    const btn = e.target.closest(".btn-delete");
    if (!btn) return;
    const id = parseInt(btn.dataset.id);
    students  = students.filter(s => s.id !== id);
    applyFilters();
});

// ── SORT ──────────────────────────────────────────────────────────

scoreHeader.addEventListener("click", () => {
    if (sortDirection === "none") sortDirection = "asc";
    else if (sortDirection === "asc")  sortDirection = "desc";
    else sortDirection = "none";

    scoreHeader.textContent = "Điểm" + SORT_ICON[sortDirection];
    applyFilters();
});

// ── EVENTS ────────────────────────────────────────────────────────

btnAdd.addEventListener("click", addStudent);

inputScore.addEventListener("keydown", e => {
    if (e.key === "Enter") addStudent();
});

searchInput.addEventListener("input", applyFilters);
selectRank.addEventListener("change", applyFilters);

// ── INIT ──────────────────────────────────────────────────────────

applyFilters();
