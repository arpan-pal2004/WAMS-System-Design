const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = "data.json";

function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Inventory
app.get("/api/inventory", (req, res) => {
  res.json(readDB().products);
});

// Orders
app.post("/api/orders", (req, res) => {
  const { productId, qty } = req.body;
  const db = readDB();

  const product = db.products.find(p => p.id === productId);

  if (!product) return res.json({ message: "Not found" });
  if (product.stock < qty) return res.json({ message: "Low stock" });

  product.stock -= qty;

  db.orders.push({
    id: "ORD" + Date.now(),
    productId,
    qty
  });

  writeDB(db);
  res.json({ message: "Order placed" });
});

// Request Quote
app.post("/api/supplier/request", (req, res) => {
  const { productId, quantity } = req.body;
  const db = readDB();

  db.suppliers.push({
    id: "SUP" + Date.now(),
    productId,
    quantity,
    quotation: null,
    status: "Pending"
  });

  writeDB(db);
  res.json({ message: "Requested" });
});

// Give Quote
app.post("/api/supplier/quote", (req, res) => {
  const { requestId, price } = req.body;
  const db = readDB();

  const reqItem = db.suppliers.find(r => r.id === requestId);
  reqItem.quotation = price;
  reqItem.status = "Quoted";

  writeDB(db);
  res.json({ message: "Quoted" });
});

// Get Requests
app.get("/api/supplier/requests", (req, res) => {
  res.json(readDB().suppliers);
});

app.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);