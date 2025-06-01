
📸 Analog Kamera API Documentation — Gaya Jaksel Edition

Halo bestie! Ini dia dokumentasi API buat marketplace kamera analog kesayangan lu 😎

Base URL: `https://yourapi.com/api`

========================================
1. 🔐 Auth Endpoint (Login & Register)
----------------------------------------

POST /auth/register
📝 Register user baru

Body:
{
  "username": "anakjaksel",
  "email": "jaksel@example.com",
  "password": "123456"
}

POST /auth/login
🔑 Login user

Body:
{
  "email": "jaksel@example.com",
  "password": "123456"
}

========================================
2. 📷 Kamera Endpoint
----------------------------------------

GET /cameras
🔍 Ambil semua kamera

GET /cameras/:id
📄 Detail kamera berdasarkan ID

POST /cameras
🆕 Tambah kamera baru (role: admin only)

PATCH /cameras/:id
🛠️ Edit kamera (admin only)

DELETE /cameras/:id
🗑️ Hapus kamera (admin only)

========================================
3. 🛒 Transaksi Endpoint (Keranjang & Checkout)
----------------------------------------

GET /transactions
📦 Ambil semua transaksi user (cart & purchase)

POST /transactions
🛍️ Tambah item ke keranjang

Body:
{
  "cameraId": "ID_CAMERA",
  "quantity": 1,
  "transaction_type": "cart"
}

PATCH /transactions/:id
✅ Checkout transaksi dari cart ke purchase

Body:
{
  "transaction_type": "purchase"
}

DELETE /transactions/:id
❌ Hapus transaksi (misal batal checkout)

========================================
4. 🚀 Contoh Pemakaian di JavaScript
----------------------------------------

const API_BASE = 'https://yourapi.com/api';

// Register
async function registerUser(data) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

// Login
async function loginUser(data) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

// Add to cart
async function addToCart(token, cameraId) {
  const response = await fetch(`${API_BASE}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      cameraId: cameraId,
      quantity: 1,
      transaction_type: 'cart'
    })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.msg);
  }
  return response.json();
}

// Checkout
async function checkoutTransaction(token, transactionId) {
  const response = await fetch(`${API_BASE}/transactions/${transactionId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      transaction_type: 'purchase'
    })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.msg);
  }
  return response.json();
}

========================================
🧠 Notes Tambahan:
- Semua request ke endpoint terlindungi harus pakai Bearer Token yaa 💳
- Role admin bisa tambah/edit/hapus kamera, role user cuma bisa view dan transaksi ✨
- Error bakal dibalikin dalam format: `{ msg: "Error message-nya nih bestie~" }`
