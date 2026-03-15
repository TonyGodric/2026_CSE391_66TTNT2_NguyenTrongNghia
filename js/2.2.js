

// ---- Dữ liệu giá sản phẩm ----
const prices = {
    "Áo thun": 150000,
    "Quần jean": 350000,
    "Giày sneaker": 890000,
    "Túi xách": 420000,
    "Đồng hồ": 1250000,
    "Kính mắt": 280000,
};

// ---- Helpers ----
const $ = id => document.getElementById(id);
const fmt = n => Number(n).toLocaleString("vi-VN") + " ₫";

function showError(fieldId, msg) {
    const el = $("error-" + fieldId);
    if (!el) return;
    el.textContent = "⚠ " + msg;
    el.style.display = "block";
    const input = $(fieldId) || document.querySelector(`[name="${fieldId}"]`);
    if (input) input.classList.add("is-invalid");
}

function clearError(fieldId) {
    const el = $("error-" + fieldId);
    if (!el) return;
    el.style.display = "none";
    const input = $(fieldId) || document.querySelector(`[name="${fieldId}"]`);
    if (input) { input.classList.remove("is-invalid"); input.classList.add("is-valid"); }
}

function clearErrorOnly(fieldId) {
    const el = $("error-" + fieldId);
    if (!el) return;
    el.style.display = "none";
    const input = $(fieldId);
    if (input) input.classList.remove("is-invalid");
}

// ---- Validate từng field ----
function validateProduct() {
    const v = $("productName").value;
    if (!v) { showError("productName", "Vui lòng chọn sản phẩm."); return false; }
    clearError("productName"); return true;
}

function validateQuantity() {
    const v = parseInt($("quantity").value);
    if (isNaN(v) || v < 1 || v > 99) { showError("quantity", "Số lượng phải từ 1 đến 99."); return false; }
    clearError("quantity"); return true;
}

function validateDate() {
    const val = $("deliveryDate").value;
    if (!val) { showError("deliveryDate", "Vui lòng chọn ngày giao hàng."); return false; }
    const selected = new Date(val);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const maxDate = new Date(today); maxDate.setDate(maxDate.getDate() + 30);
    if (selected < today) { showError("deliveryDate", "Ngày giao không được là ngày quá khứ."); return false; }
    if (selected > maxDate) { showError("deliveryDate", "Ngày giao không quá 30 ngày từ hôm nay."); return false; }
    clearError("deliveryDate"); return true;
}

function validateAddress() {
    const v = $("address").value.trim();
    if (!v || v.length < 10) { showError("address", "Địa chỉ phải ít nhất 10 ký tự."); return false; }
    clearError("address"); return true;
}

function validateNote() {
    const v = $("note").value;
    if (v.length > 200) { showError("note", "Ghi chú không quá 200 ký tự."); return false; }
    clearErrorOnly("note"); return true;
}

function validatePayment() {
    const checked = document.querySelector('input[name="payment"]:checked');
    if (!checked) { showError("payment", "Vui lòng chọn phương thức thanh toán."); return false; }
    $("error-payment").style.display = "none"; return true;
}

function validateAll() {
    const r = [validateProduct(), validateQuantity(), validateDate(), validateAddress(), validateNote(), validatePayment()];
    return r.every(Boolean);
}

// ---- Tính tổng tiền ----
function updateTotal() {
    const product = $("productName").value;
    const qty = parseInt($("quantity").value);
    const price = prices[product] || 0;
    const total = (price && qty >= 1 && qty <= 99) ? price * qty : 0;
    $("totalPrice").textContent = total > 0 ? fmt(total) : "0 ₫";
}

// ---- Đếm ký tự ghi chú ----
$("note").addEventListener("input", () => {
    const len = $("note").value.length;
    const counter = $("charCounter");
    counter.textContent = len + "/200";
    if (len > 200) {
        counter.classList.add("over");
        showError("note", "Ghi chú không quá 200 ký tự.");
    } else {
        counter.classList.remove("over");
        clearErrorOnly("note");
    }
});

// ---- Blur listeners ----
$("productName").addEventListener("change", () => { validateProduct(); updateTotal(); });
$("quantity").addEventListener("input", () => { validateQuantity(); updateTotal(); });
$("deliveryDate").addEventListener("blur", validateDate);
$("address").addEventListener("blur", validateAddress);
$("address").addEventListener("input", () => { if ($("address").classList.contains("is-invalid")) validateAddress(); });
document.querySelectorAll('input[name="payment"]').forEach(r => r.addEventListener("change", validatePayment));

// ---- Submit ----
$("orderForm").addEventListener("submit", e => {
    e.preventDefault();
    if (!validateAll()) return;

    // Build summary
    const product = $("productName").value;
    const qty = parseInt($("quantity").value);
    const price = prices[product] || 0;
    const total = price * qty;
    const date = new Date($("deliveryDate").value).toLocaleDateString("vi-VN");
    const payment = document.querySelector('input[name="payment"]:checked').value;

    $("orderSummary").innerHTML = `
            <div class="summary-row"><span class="s-label">Sản phẩm</span><span class="s-value">${product}</span></div>
            <div class="summary-row"><span class="s-label">Số lượng</span><span class="s-value">${qty}</span></div>
            <div class="summary-row total"><span class="s-label">Tổng tiền</span><span class="s-value">${fmt(total)}</span></div>
            <div class="summary-row"><span class="s-label">Ngày giao</span><span class="s-value">${date}</span></div>
            <div class="summary-row"><span class="s-label">Địa chỉ</span><span class="s-value" style="max-width:220px;text-align:right">${$("address").value.trim()}</span></div>
            <div class="summary-row"><span class="s-label">Thanh toán</span><span class="s-value">${payment}</span></div>
        `;

    $("confirmModal").classList.add("show");
});
$("confirmBtn").addEventListener("click", () => {
    $("confirmModal").classList.remove("show");
    alert("Cảm ơn bạn đã đặt hàng! Chúng tôi sẽ liên hệ với bạn sớm nhất.");
});

$("cancelBtn").addEventListener("click", () => {
    $("confirmModal").classList.remove("show");
});
