window.VoltixComponents = (function () {
  const customerPages = new Set(['dashboard','bills','payment','card-payment','payment-success','complaint','complaint-success','complaint-status']);
  const adminPages = new Set(['admin-dashboard','admin-bills','admin-complaints','admin-customers']);
  function page() { return document.body.dataset.page || 'dashboard'; }
  function renderBackground() { const root = document.getElementById('background-root'); if (root) root.innerHTML = '<div class="bg-orb bg-orb-1"></div><div class="bg-orb bg-orb-2"></div>'; }
  function navItems(role) { return role === 'Admin' ? [ ['admin-dashboard','Admin Dashboard','admin-dashboard.html'], ['admin-bills','Bills','admin-bills.html'], ['admin-complaints','Complaints','admin-complaints.html'], ['admin-customers','Customers','admin-customers.html'] ] : [ ['dashboard','Dashboard','dashboard.html'], ['bills','Bills','bills.html'], ['complaint','Register Complaint','complaint.html'], ['complaint-status','Complaint Status','complaint-status.html'] ]; }
  function renderNavbar() {
    const root = document.getElementById('navbar-root'); if (!root) return;
    const p = page(); const authPage = ['login','register','register-success'].includes(p);
    if (authPage) {
      root.innerHTML = `<nav class="navbar navbar-expand-lg dashboard-navbar sticky-top"><div class="container-xxl"><a class="navbar-brand d-flex align-items-center gap-2" href="index.html"><div class="brand-mark"><i class="bi bi-lightning-charge-fill"></i></div><div><span class="brand-text">Voltix</span><small class="brand-subtext d-block">Electricity Billing</small></div></a><div class="d-flex align-items-center gap-2 ms-auto"><a class="btn btn-outline-soft btn-sm-custom" href="index.html">Login</a><a class="btn btn-accent btn-sm-custom" href="register.html">Register</a></div></div></nav>`;
      return;
    }
    const user = window.VoltixCommon.getCurrentUser(); const role = user?.role || 'Customer'; const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || role)}&background=random`;
    root.innerHTML = `<nav class="navbar navbar-expand-lg dashboard-navbar sticky-top"><div class="container-xxl"><a class="navbar-brand d-flex align-items-center gap-2" href="${role === 'Admin' ? 'admin-dashboard.html' : 'dashboard.html'}"><div class="brand-mark"><i class="bi bi-lightning-charge-fill"></i></div><div><span class="brand-text">Voltix</span><small class="brand-subtext d-block">Electricity Billing</small></div></a><button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav"><span class="navbar-toggler-icon custom-toggler-icon"></span></button><div class="collapse navbar-collapse" id="mainNav"><ul class="navbar-nav mx-auto mb-3 mb-lg-0 nav-pill-group">${navItems(role).map(item => `<li class="nav-item"><a class="nav-link ${p === item[0] ? 'active' : ''}" href="${item[2]}">${item[1]}</a></li>`).join('')}</ul><div class="d-flex align-items-center gap-3"><a href="profile.html" class="profile-chip text-decoration-none"><img src="${avatarUrl}" class="profile-avatar" alt="Avatar" style="object-fit:cover;"><div class="profile-info"><span class="profile-name">Welcome, ${window.VoltixCommon.escapeHtml(user?.name || role)}</span><small class="profile-role">${role}</small></div></a><button class="btn btn-outline-soft btn-sm-custom" id="logoutBtn" type="button"><i class="bi bi-box-arrow-right me-2"></i>Logout</button></div></div></div></nav>`;
  }
  function renderFooter() { const root = document.getElementById('footer-root'); if (root) root.innerHTML = '<footer class="site-footer"><div class="container-xxl"><p class="mb-0 text-center">Copyright Voltix - 2026. All rights reserved. Providing secure and reliable electricity billing services.</p></div></footer>'; }
  function attachEvents() { 
    document.addEventListener('click', e => { const btn = e.target.closest('#logoutBtn'); if (btn) window.VoltixCommon.logout(); }); 
    const p = page();
    if (['dashboard', 'admin-dashboard'].includes(p)) {
      window.history.pushState({ noBack: true }, '');
      window.addEventListener('popstate', (e) => {
        if (window.confirm("Do you want to logout?")) {
          window.VoltixCommon.logout();
        } else {
          window.history.pushState({ noBack: true }, '');
        }
      });
    }
  }
  function boot() { renderBackground(); renderNavbar(); renderFooter(); const p = page(); if (customerPages.has(p)) window.VoltixCommon.ensureRole('Customer'); if (adminPages.has(p)) window.VoltixCommon.ensureRole('Admin'); attachEvents(); }
  return { boot };
})();
document.addEventListener('DOMContentLoaded', () => window.VoltixComponents.boot());


