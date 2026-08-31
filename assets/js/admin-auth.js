// ============================================================
// Admin Auth Guard
// ============================================================
const ADMIN_SESSION_KEY = 'ssr_admin_session';
// Credentials stored in frontend (obfuscated base64)
const _u = atob('YWRtaW4=');       // admin
const _p = atob('c3NyQDIwMjU=');   // ssr@2025

function adminLogin(username, password) {
  if (username === _u && password === _p) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, btoa(Date.now().toString()));
    return true;
  }
  return false;
}

function isAdminLoggedIn() {
  return !!sessionStorage.getItem(ADMIN_SESSION_KEY);
}

function adminLogout() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  window.location.href = 'login.html';
}

// Guard: if on dashboard without session → redirect to login
if (window.location.pathname.includes('dashboard')) {
  if (!isAdminLoggedIn()) window.location.href = 'login.html';
}

// Guard: if on login WITH session → redirect to dashboard
if (window.location.pathname.includes('login')) {
  if (isAdminLoggedIn()) window.location.href = 'dashboard.html';
}
