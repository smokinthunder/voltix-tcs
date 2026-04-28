document.addEventListener('DOMContentLoaded', () => {
  const user = window.VoltixCommon.ensureRole('Admin'); if (!user) return;
  const search = document.getElementById('adminBillSearch'); const status = document.getElementById('adminBillStatus'); const body = document.getElementById('adminBillBody'); const count = document.getElementById('adminBillCount');
  function render() { const q = search.value.trim().toLowerCase(); const s = status.value; const rows = window.VoltixCommon.getBills().filter(b => `${b.billNumber} ${b.month} ${b.customerName} ${b.accountNo} ${b.consumerNo}`.toLowerCase().includes(q)).filter(b => !s || b.status === s); count.textContent = `${rows.length} bill${rows.length === 1 ? '' : 's'} shown`; body.innerHTML = rows.length ? rows.map((b,i) => `<tr><td>${i+1}</td><td>${b.billNumber}</td><td>${b.customerName}</td><td>${b.accountNo}</td><td>${b.month}</td><td>${window.VoltixCommon.currency(b.amount)}</td><td>${b.dueDate}</td><td><span class="soft-badge ${b.status === 'Paid' ? 'paid-badge' : 'pending-badge'}">${b.status}</span></td></tr>`).join('') : '<tr><td colspan="8"><div class="empty-state">No bills matched your filters.</div></td></tr>'; }
  search.addEventListener('input', render); status.addEventListener('change', render); render();
});


