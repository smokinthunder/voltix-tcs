document.addEventListener('DOMContentLoaded', () => {
  const current = window.VoltixCommon.getCurrentUser();
  if (current) { window.location.href = current.role === 'Admin' ? 'admin-dashboard.html' : 'dashboard.html'; return; }
  document.getElementById('fillCustomerBtn')?.addEventListener('click', () => { document.getElementById('userId').value = 'demoUser'; document.getElementById('password').value = 'Demo@123'; });
  document.getElementById('fillAdminBtn')?.addEventListener('click', () => { document.getElementById('userId').value = 'admin'; document.getElementById('password').value = 'Admin@123'; });
  document.getElementById('loginForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const userId = document.getElementById('userId').value.trim();
    const password = document.getElementById('password').value;
    const result = window.VoltixCommon.login(userId, password);
    if (!result.ok) return window.VoltixCommon.toast('Login failed', result.message);
    window.location.href = result.user.role === 'Admin' ? 'admin-dashboard.html' : 'dashboard.html';
  });
});


