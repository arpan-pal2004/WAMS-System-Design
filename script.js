const API = "http://localhost:3000/api";

// Load inventory
async function loadInventory() {
  const res = await fetch(`${API}/inventory`);
  const data = await res.json();

  // Table
  document.getElementById("table-body").innerHTML =
    data.map(p => `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td style="color:${p.stock < 5 ? 'red' : 'green'}">
          ${p.stock}
        </td>
        <td>$${p.price}</td>
      </tr>
    `).join("");

  // Stats
  document.getElementById("total-products").innerText = data.length;

  const lowStock = data.filter(p => p.stock < 5).length;
  document.getElementById("low-stock-count").innerText = lowStock;
}

// Place order
async function placeOrder() {
  const productId = document.getElementById("pid").value;
  const qty = document.getElementById("qty").value;

  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      productId,
      qty: Number(qty),
      dealerId: "DEALER-01"
    })
  });

  const data = await res.json();

  if (res.ok) {
    document.getElementById("msg").innerText =
      `Order ${data.order_id} placed`;
    loadInventory();
  } else {
    document.getElementById("msg").innerText = data.message;
  }
}

// Supplier quotation
async function requestQuote() {
  const productId = document.getElementById("sup-pid").value;
  const quantity = document.getElementById("sup-qty").value;

  const res = await fetch(`${API}/supplier/request`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ productId, quantity })
  });

  const data = await res.json();

  document.getElementById("supplier-msg").innerText =
    `Quotation: $${data.quotation}`;
}

// Add stock
async function addStock() {
  const productId = document.getElementById("sup-pid").value;
  const quantity = document.getElementById("sup-qty").value;

  const res = await fetch(`${API}/supplier/add-stock`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      productId,
      quantity: Number(quantity)
    })
  });

  const data = await res.json();

  document.getElementById("supplier-msg").innerText =
    data.message;

  loadInventory();
}

// Switch views
function showView(view) {
  document.getElementById("admin-view").classList.add("hidden");
  document.getElementById("dealer-view").classList.add("hidden");
  document.getElementById("supplier-view").classList.add("hidden");

  document.getElementById(view + "-view").classList.remove("hidden");
}

window.onload = loadInventory;