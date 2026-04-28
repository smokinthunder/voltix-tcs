document.addEventListener('DOMContentLoaded', () => {
  const p = document.body.dataset.page;
  if (p === 'register') {
    const title = document.getElementById('title'); const cc = document.getElementById('countryCode');
    window.VoltixData.titles.forEach(t => title.insertAdjacentHTML('beforeend', `<option value="${t}">${t}</option>`));
    window.VoltixData.countryCodes.forEach(c => cc.insertAdjacentHTML('beforeend', `<option value="${c}">${c}</option>`));
    document.getElementById('registrationForm')?.addEventListener('submit', e => {
      e.preventDefault();
      const pwd = document.getElementById('regPassword').value; const cpwd = document.getElementById('confirmPassword').value;
      if (pwd !== cpwd) return window.VoltixCommon.toast('Validation', 'Password and Confirm Password should match.');
      const payload = {
        consumerId: document.getElementById('consumerId').value.trim(), billNumber: document.getElementById('billNumber').value.trim(), title: document.getElementById('title').value, name: document.getElementById('customerName').value.trim(), email: document.getElementById('email').value.trim(), mobileCode: document.getElementById('countryCode').value, mobile: document.getElementById('mobile').value.trim(), userId: document.getElementById('regUserId').value.trim(), password: pwd
      };
      if (!payload.consumerId || payload.consumerId.length !== 13) return window.VoltixCommon.toast('Validation', 'Consumer ID must be 13 digits.');
      if (!payload.billNumber || payload.billNumber.length !== 5) return window.VoltixCommon.toast('Validation', 'Bill Number must be 5 digits.');
      if (!payload.mobile || payload.mobile.length !== 10) return window.VoltixCommon.toast('Validation', 'Mobile number must be 10 digits.');
      const result = window.VoltixCommon.registerUser(payload); if (!result.ok) return window.VoltixCommon.toast('Registration failed', result.message);
      window.location.href = 'register-success.html';
    });
    document.getElementById('resetRegistration')?.addEventListener('click', () => document.getElementById('registrationForm').reset());
  }
  if (p === 'register-success') {
    const user = window.VoltixCommon.getLastRegistration();
    const root = document.getElementById('registrationAck');
    if (!user) { root.innerHTML = '<div class="empty-state">No recent registration found.</div>'; return; }
    root.innerHTML = `<div class="alert alert-success-soft mb-4"><i class="bi bi-check-circle-fill me-2"></i><strong>Consumer Registration successful.</strong></div><div class="bill-breakdown"><div class="bill-item"><span>Customer ID</span><strong>${user.customerId}</strong></div><div class="bill-item"><span>Customer Name</span><strong>${user.name}</strong></div><div class="bill-item"><span>Email</span><strong>${user.email}</strong></div><div class="bill-item"><span>User ID</span><strong>${user.userId}</strong></div></div>`;
  }
});


