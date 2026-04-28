document.addEventListener('DOMContentLoaded', () => {
  const user = window.VoltixCommon.ensureRole('Admin'); if (!user) return;
  const search = document.getElementById('adminCustomerSearch'); const body = document.getElementById('adminCustomerBody'); const count = document.getElementById('adminCustomerCountList');
  function render() { const q = search.value.trim().toLowerCase(); const rows = window.VoltixCommon.getUsers().filter(u => u.role === 'Customer').filter(u => `${u.customerId} ${u.consumerId} ${u.name} ${u.email} ${u.userId}`.toLowerCase().includes(q)); count.textContent = `${rows.length} customer${rows.length === 1 ? '' : 's'} shown`; body.innerHTML = rows.length ? rows.map((c,i) => `<tr><td>${i+1}</td><td>${c.customerId || '-'}</td><td>${c.consumerId}</td><td>${c.name}</td><td>${c.email}</td><td>${c.mobileCode} ${c.mobile}</td><td>${c.userId}</td><td>${c.accountNo || '-'}</td></tr>`).join('') : '<tr><td colspan="8"><div class="empty-state">No customer profiles matched your search.</div></td></tr>'; }
  search.addEventListener('input', render); render();
});


