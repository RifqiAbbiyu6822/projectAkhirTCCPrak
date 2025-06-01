const API_URL = "https://backend-project-akhir-245069416476.asia-southeast2.run.app";

const btnShowLogin = document.getElementById("btnShowLogin");
const btnShowRegister = document.getElementById("btnShowRegister");
const btnLogout = document.getElementById("btnLogout");

const authForms = document.getElementById("authForms");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");

const mainSection = document.querySelector("main");
const cameraGrid = document.getElementById("cameraGrid");
const statusMessage = document.getElementById("statusMessage");

const loginMsg = document.getElementById("loginMsg");
const registerMsg = document.getElementById("registerMsg");

// Modal elements
const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalBrand = document.getElementById("modalBrand");
const modalModel = document.getElementById("modalModel");
const modalType = document.getElementById("modalType");
const modalYear = document.getElementById("modalYear");
const modalFormat = document.getElementById("modalFormat");
const modalPrice = document.getElementById("modalPrice");
const modalStock = document.getElementById("modalStock");

let camerasData = []; // Store cameras for filtering

// Show/hide forms
btnShowLogin.onclick = () => {
  authForms.style.display = "block";
  loginForm.style.display = "block";
  registerForm.style.display = "none";
  loginMsg.textContent = "";
  registerMsg.textContent = "";
};

btnShowRegister.onclick = () => {
  authForms.style.display = "block";
  loginForm.style.display = "none";
  registerForm.style.display = "block";
  loginMsg.textContent = "";
  registerMsg.textContent = "";
};

btnLogout.onclick = () => {
  clearToken();
  updateUI();
};

// Token helpers
function saveToken(token) {
  localStorage.setItem("jwtToken", token);
}

function getToken() {
  return localStorage.getItem("jwtToken");
}

function clearToken() {
  localStorage.removeItem("jwtToken");
}

// Update UI depending on login status
function updateUI() {
  if (getToken()) {
    authForms.style.display = "none";
    mainSection.style.display = "block";
    btnLogout.style.display = "inline-block";
    btnShowLogin.style.display = "none";
    btnShowRegister.style.display = "none";
    fetchCameras();
  } else {
    authForms.style.display = "none";
    mainSection.style.display = "none";
    btnLogout.style.display = "none";
    btnShowLogin.style.display = "inline-block";
    btnShowRegister.style.display = "inline-block";
  }
}

// Register user
registerBtn.onclick = async () => {
  registerMsg.textContent = "";
  const username = document.getElementById("regUsername").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  if (!username || !email || !password) {
    registerMsg.textContent = "Isi semua kolom!";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Registrasi gagal");
    alert("Registrasi berhasil! Silakan login.");
    btnShowLogin.onclick();
  } catch (err) {
    registerMsg.textContent = err.message;
  }
};

// Login user
loginBtn.onclick = async () => {
  loginMsg.textContent = "";
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    loginMsg.textContent = "Isi username dan password!";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Login gagal");
    saveToken(data.token);
    updateUI();
  } catch (err) {
    loginMsg.textContent = err.message;
  }
};

// Fetch camera data from backend and render cards
async function fetchCameras() {
  cameraGrid.innerHTML = "<p>Memuat daftar kamera...</p>";
  try {
    const res = await fetch(`${API_URL}/cameras`);
    if (!res.ok) throw new Error("Gagal mengambil data kamera");
    const cameras = await res.json();
    camerasData = cameras; // Save for filtering
    renderCameras(camerasData);
  } catch (err) {
    cameraGrid.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

function renderCameras(cameras) {
  if (cameras.length === 0) {
    cameraGrid.innerHTML = "<p>Tidak ada kamera yang cocok.</p>";
    return;
  }
  cameraGrid.innerHTML = "";
  cameras.forEach((cam) => {
    const card = document.createElement("div");
    card.className = "camera-card";
    card.innerHTML = `
      <img src="https://via.placeholder.com/300x180?text=Camera" alt="Camera Image" />
      <div class="info">
        <h3>${cam.brand} ${cam.model}</h3>
        <p>Tipe: ${cam.type}</p>
        <p>Tahun: ${cam.year_released || "-"}</p>
        <p>Format: ${cam.format || "-"}</p>
        <div class="price">$${cam.price || "-"}</div>
      </div>
    `;
    card.onclick = () => showModal(cam);
    cameraGrid.appendChild(card);
  });
}

// Modal
function showModal(cam) {
  modalTitle.textContent = `${cam.brand} ${cam.model}`;
  modalBrand.textContent = cam.brand;
  modalModel.textContent = cam.model;
  modalType.textContent = cam.type;
  modalYear.textContent = cam.year_released || "-";
  modalFormat.textContent = cam.format || "-";
  modalPrice.textContent = cam.price || "-";
  modalStock.textContent = cam.stock || "0";
  modal.style.display = "flex";
}

modalClose.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Search and filter
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");

function applyFilter() {
  const searchTerm = searchInput.value.toLowerCase();
  const filter = filterType.value;
  const filtered = camerasData.filter((cam) => {
    const matchesSearch =
      cam.brand.toLowerCase().includes(searchTerm) ||
      cam.model.toLowerCase().includes(searchTerm);
    const matchesFilter = filter ? cam.type === filter : true;
    return matchesSearch && matchesFilter;
  });
  renderCameras(filtered);
}

searchInput.addEventListener("input", applyFilter);
filterType.addEventListener("change", applyFilter);

// Initialize UI on page load
updateUI();
