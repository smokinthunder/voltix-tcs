document.addEventListener('DOMContentLoaded', () => {
  const current = window.VoltixCommon.getCurrentUser();
  if (current) { window.location.href = current.role === 'Admin' ? 'admin-dashboard.html' : 'dashboard.html'; return; }
  document.getElementById('loginForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const userId = document.getElementById('userId').value.trim();
    const password = document.getElementById('password').value;
    const result = window.VoltixCommon.login(userId, password);
    if (!result.ok) return window.VoltixCommon.toast('Login failed', result.message);
    window.location.href = result.user.role === 'Admin' ? 'admin-dashboard.html' : 'dashboard.html';
  });
});


