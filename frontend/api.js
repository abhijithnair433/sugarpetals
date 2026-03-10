// ============================================================
// SugarPetals API Client
// Base URL: http://127.0.0.1:8000/api
// ============================================================

const API_BASE = "http://127.0.0.1:8000/api";

// ── Core request function ────────────────────────────────────
async function request(method, path, body = null, auth = true, isFormData = false) {
  const headers = {};
  if (!isFormData) headers["Content-Type"] = "application/json";

  const token = localStorage.getItem("access_token");
  if (auth && token) headers["Authorization"] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = isFormData ? body : JSON.stringify(body);

  let res = await fetch(API_BASE + path, options);

  // Silent token refresh on 401
  if (res.status === 401 && auth) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      headers["Authorization"] = `Bearer ${localStorage.getItem("access_token")}`;
      res = await fetch(API_BASE + path, { method, headers, body: options.body });
    } else {
      clearAuth();
      window.location.href = "login.html";
      return;
    }
  }

  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// ── Token refresh ────────────────────────────────────────────
async function refreshAccessToken() {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return false;
  try {
    const res = await fetch(API_BASE + "/accounts/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem("access_token", data.access);
    return true;
  } catch {
    return false;
  }
}

// ── Auth helpers ─────────────────────────────────────────────
function clearAuth() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
}

function getUser() {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
}

function getRole() {
  const user = getUser();
  if (!user) return null;
  if (user.is_staff || user.is_superuser || user.role === "admin") return "admin";
  return user.role;
}

// ── Auth API ─────────────────────────────────────────────────
const Auth = {
  async register(payload) {
    return request("POST", "/accounts/register/", payload, false);
  },
  async login(username, password) {
    const { access, refresh } = await request("POST", "/accounts/login/", { username, password }, false);
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    const user = await request("GET", "/accounts/profile/");
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  },
  async getProfile() {
    return request("GET", "/accounts/profile/");
  },
  async updateProfile(payload) {
    return request("PATCH", "/accounts/profile/", payload);
  },
  logout() {
    clearAuth();
    window.location.href = "login.html";
  },
};

// ── Products API ─────────────────────────────────────────────
const Products = {
  async list(params = {}) {
    const q = new URLSearchParams(params).toString();
    return request("GET", `/products/${q ? "?" + q : ""}`, null, false);
  },
  async get(id) {
    return request("GET", `/products/${id}/`, null, false);
  },
  async categories() {
    return request("GET", "/products/categories/", null, false);
  },
  async myProducts() {
    return request("GET", "/products/my-products/");
  },
  async addProduct(payload) {
    return request("POST", "/products/my-products/add/", payload);
  },
  async updateProduct(id, payload) {
    return request("PATCH", `/products/my-products/${id}/`, payload);
  },
  async deleteProduct(id) {
    return request("DELETE", `/products/my-products/${id}/`);
  },
};

// ── Stores API ───────────────────────────────────────────────
const Stores = {
  async list() {
    return request("GET", "/stores/", null, false);
  },
  async register(payload) {
    return request("POST", "/stores/register/", payload);
  },
  async myStore() {
    return request("GET", "/stores/my-store/");
  },
  async updateMyStore(payload) {
    return request("PUT", "/stores/my-store/", payload);
  },
  async adminAll() {
    return request("GET", "/stores/admin/all/");
  },
  async adminUpdateStatus(id, payload) {
    return request("PATCH", `/stores/admin/${id}/status/`, payload);
  },
};

// ── Cart API ─────────────────────────────────────────────────
const Cart = {
  async get() {
    return request("GET", "/cart/");
  },
  async add(product_id, quantity) {
    return request("POST", "/cart/add/", { product_id, quantity });
  },
  async update(id, quantity) {
    return request("PATCH", `/cart/${id}/update/`, { quantity });
  },
  async remove(id) {
    return request("DELETE", `/cart/${id}/remove/`);
  },
};

// ── Orders API ───────────────────────────────────────────────
const Orders = {
  async place() {
    return request("POST", "/orders/place/");
  },
  async myOrders(params = {}) {
    const q = new URLSearchParams(params).toString();
    return request("GET", `/orders/${q ? "?" + q : ""}`);
  },
  async getOrder(id) {
    return request("GET", `/orders/${id}/`);
  },
  async sellerOrders() {
    return request("GET", "/orders/my-orders/");
  },
  async sellerUpdateStatus(id, status) {
    return request("PATCH", `/orders/my-orders/${id}/status/`, { status });
  },
  async adminAll() {
    return request("GET", "/orders/admin/all/");
  },
};

// ── Delivery API ─────────────────────────────────────────────
const Delivery = {
  async register(payload) {
    return request("POST", "/delivery/register/", payload);
  },
  async getProfile() {
    return request("GET", "/delivery/profile/");
  },
  async updateProfile(payload) {
    return request("PATCH", "/delivery/profile/", payload);
  },
  async myDeliveries() {
    return request("GET", "/delivery/my-deliveries/");
  },
  async updateStatus(id, status) {
    return request("PATCH", `/delivery/my-deliveries/${id}/status/`, { status });
  },
  async adminAll() {
    return request("GET", "/delivery/admin/all/");
  },
  async adminAgents() {
    return request("GET", "/delivery/admin/agents/");
  },
  async adminAssign(order_id, agent_id) {
    return request("POST", `/delivery/admin/assign/${order_id}/`, { agent_id });
  },
  async availableOrders(city = "") {
    const q = city ? `?city=${encodeURIComponent(city)}` : "";
    return request("GET", `/delivery/available-orders/${q}`);
  },
  async selfPickup(order_id) {
    return request("POST", `/delivery/pickup/${order_id}/`);
  },
};

// ── Reviews API ──────────────────────────────────────────────
const Reviews = {
  async forProduct(product_id) {
    return request("GET", `/reviews/product/${product_id}/`, null, false);
  },
  async add(product_id, payload) {
    return request("POST", `/reviews/product/${product_id}/add/`, payload);
  },
  async delete(product_id) {
    return request("DELETE", `/reviews/product/${product_id}/delete/`);
  },
  async myReviews() {
    return request("GET", "/reviews/my-reviews/");
  },
};
