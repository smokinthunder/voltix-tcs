document.addEventListener('DOMContentLoaded', () => {
  const user = window.VoltixCommon.ensureRole('Customer'); if (!user) return;
  const body = document.getElementById('billListBody');
  function render() {
    const bills = window.VoltixCommon.getBills(); const selected = new Set(window.VoltixCommon.getSelectedBills());
    body.innerHTML = bills.map((b,i) => `<tr><td>${['Pending','Overdue'].includes(b.status) ? `<input class="form-check-input bill-checkbox" type="checkbox" value="${b.id}" ${selected.has(b.id) ? 'checked' : ''}>` : '<i class="bi bi-check2-all text-success"></i>'}</td><td>${i+1}</td><td>${b.billNumber}</td><td>${b.month}</td><td>${b.period}</td><td>${b.units} kWh</td><td>${window.VoltixCommon.currency(b.amount)}</td><td>${b.dueDate}</td><td><span class="soft-badge ${b.status === 'Paid' ? 'paid-badge' : 'pending-badge'}">${b.status}</span></td></tr>`).join('');
    document.querySelectorAll('.bill-checkbox').forEach(c => c.addEventListener('change', () => { window.VoltixCommon.setSelectedBills(Array.from(document.querySelectorAll('.bill-checkbox:checked')).map(x => x.value)); update(); }));
    update();
  }
  function update() { const s = window.VoltixCommon.computePaymentSummary(); document.getElementById('selectedTotal').textContent = window.VoltixCommon.currency(s.billAmount); document.getElementById('selectedCount').textContent = `${s.selected.length} bill${s.selected.length === 1 ? '' : 's'} selected`; }
  document.getElementById('selectPendingBtn')?.addEventListener('click', () => { window.VoltixCommon.setSelectedBills(window.VoltixCommon.getPendingBills().map(b => b.id)); render(); });
  document.getElementById('clearSelectionBtn')?.addEventListener('click', () => { window.VoltixCommon.setSelectedBills([]); render(); });
  document.getElementById('proceedToPayBtn')?.addEventListener('click', () => { const s = window.VoltixCommon.computePaymentSummary(); if (!s.selected.length) return window.VoltixCommon.toast('Selection required', 'Please select at least one bill.'); window.location.href = 'payment.html'; });
  render();
});


