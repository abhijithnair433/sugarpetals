// ============================================================
// SugarPetals — Shared Utilities
// ============================================================

// ── Role-based redirect after login ─────────────────────────
function redirectByRole(user) {
  const isAdmin = user.is_staff || user.is_superuser || user.role === "admin";
  if (isAdmin) return (window.location.href = "admin.html");
  if (user.role === "seller") return (window.location.href = "seller.html");
  if (user.role === "delivery") return (window.location.href = "delivery.html");
  window.location.href = "customer.html";
}

// ── Auth guard — call at top of protected pages ──────────────
function requireAuth(allowedRoles = []) {
  const user = getUser();
  if (!user || !localStorage.getItem("access_token")) {
    sessionStorage.setItem("redirect_after_login", window.location.href);
    window.location.href = "login.html";
    return null;
  }
  const role = getRole();
  if (allowedRoles.length && !allowedRoles.includes(role)) {
    window.location.href = "login.html";
    return null;
  }
  return user;
}

// ── Toast notifications ──────────────────────────────────────
function toast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const t = document.createElement("div");
  t.className = `toast toast-${type}`;
  t.innerHTML = `<span class="toast-icon">${type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}</span><span>${message}</span>`;
  container.appendChild(t);
  requestAnimationFrame(() => t.classList.add("show"));
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 400);
  }, 3500);
}

// ── Parse API errors into readable string ────────────────────
function parseError(err) {
  if (!err) return "Something went wrong.";
  if (typeof err === "string") return err;
  if (err.detail) return err.detail;
  if (err.error) return err.error;
  const msgs = [];
  for (const [key, val] of Object.entries(err)) {
    const v = Array.isArray(val) ? val.join(", ") : val;
    msgs.push(`${key}: ${v}`);
  }
  return msgs.join(" | ") || "Something went wrong.";
}

// ── Loading state helpers ────────────────────────────────────
function setLoading(btn, loading = true) {
  if (!btn) return;
  if (loading) {
    btn.dataset.originalText = btn.innerHTML;
    btn.innerHTML = `<span class="spinner"></span> Loading…`;
    btn.disabled = true;
  } else {
    btn.innerHTML = btn.dataset.originalText || "Submit";
    btn.disabled = false;
  }
}

// ── Pagination helper ────────────────────────────────────────
function createLoadMore(container, loadFn) {
  const btn = document.createElement("button");
  btn.className = "btn btn-outline load-more-btn";
  btn.textContent = "Load More";
  btn.onclick = async () => {
    setLoading(btn, true);
    await loadFn();
    setLoading(btn, false);
  };
  container.appendChild(btn);
  return btn;
}

// ── Image fallback ───────────────────────────────────────────
function productImg(src) {
  if (!src || src === "nill" || src.trim() === "") {
    return `<div class="img-placeholder"><span>🍰</span></div>`;
  }
  return `<img src="${src}" alt="product" onerror="this.parentElement.innerHTML='<div class=\"img-placeholder\"><span>🍰</span></div>'" />`;
}

// ── Status badge ─────────────────────────────────────────────
function statusBadge(status) {
  const map = {
    pending: "badge-warning",
    confirmed: "badge-info",
    baking: "badge-info",
    out_for_delivery: "badge-primary",
    delivered: "badge-success",
    cancelled: "badge-danger",
    approved: "badge-success",
    suspended: "badge-danger",
    assigned: "badge-info",
    picked_up: "badge-primary",
  };
  const cls = map[status] || "badge-secondary";
  return `<span class="badge ${cls}">${status.replace(/_/g, " ")}</span>`;
}

// ── Format date ──────────────────────────────────────────────
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Render navbar user info ──────────────────────────────────
function renderNavUser() {
  const user = getUser();
  const el = document.getElementById("nav-user");
  if (!el || !user) return;
  el.innerHTML = `
    <span class="nav-username">👤 ${user.username}</span>
    <span class="nav-role-badge">${getRole()}</span>
    <button class="btn btn-sm btn-outline" onclick="Auth.logout()">Logout</button>
  `;
}

document.addEventListener("DOMContentLoaded", renderNavUser);
