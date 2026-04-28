document.addEventListener('DOMContentLoaded', () => {
  const user = window.VoltixCommon.ensureRole('Customer'); if (!user) return;
  const page = document.body.dataset.page;
  if (page === 'payment') {
    const s = window.VoltixCommon.computePaymentSummary(); if (!s.selected.length) { window.VoltixCommon.toast('No bills selected', 'Select a bill first.'); setTimeout(() => window.location.href='bills.html', 600); return; }
    document.getElementById('billAmount').textContent = window.VoltixCommon.currency(s.billAmount); document.getElementById('pgCharge').textContent = window.VoltixCommon.currency(s.pgCharge); document.getElementById('totalPayable').textContent = window.VoltixCommon.currency(s.total); document.getElementById('selectedBillsList').innerHTML = s.selected.map(b => `<div class="summary-line"><span>${b.month} (${b.billNumber})</span><strong>${window.VoltixCommon.currency(b.amount)}</strong></div>`).join('');
    document.querySelectorAll('.payment-method').forEach(btn => btn.addEventListener('click', () => { document.querySelectorAll('.payment-method').forEach(x => x.classList.remove('active')); btn.classList.add('active'); localStorage.setItem('voltix_payment_mode', btn.dataset.mode); document.getElementById('selectedModeLabel').textContent = btn.dataset.mode; }));
    document.getElementById('goCardPaymentBtn')?.addEventListener('click', () => window.location.href = 'card-payment.html');
    document.getElementById('backHomeBtn')?.addEventListener('click', () => window.location.href = 'dashboard.html');
  }
  if (page === 'card-payment') {
    const s = window.VoltixCommon.computePaymentSummary(); if (!s.selected.length) { window.location.href = 'bills.html'; return; }
    const mode = localStorage.getItem('voltix_payment_mode') || 'Debit/Credit Card'; document.getElementById('cardBillAmount').textContent = window.VoltixCommon.currency(s.total); document.getElementById('cardModeText').textContent = mode; document.getElementById('selectedModeLabel').textContent = mode;
    document.getElementById('expiryDate')?.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
      e.target.value = v;
    });
    document.getElementById('cardPaymentForm')?.addEventListener('submit', e => { e.preventDefault(); const cn = document.getElementById('cardNumber').value.replace(/\s+/g, ''); const ch = document.getElementById('cardHolderName').value.trim(); const ex = document.getElementById('expiryDate').value.trim(); const cvv = document.getElementById('cvv').value.trim(); if (!/^\d{16,}$/.test(cn)) return window.VoltixCommon.toast('Validation', 'Card Number must contain at least 16 digits.'); if (ch.length < 10) return window.VoltixCommon.toast('Validation', 'Card Holder Name must be at least 10 characters.'); if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(ex)) return window.VoltixCommon.toast('Validation', 'Expiry Date must be in MM/YY format.'); if (!/^\d{3,4}$/.test(cvv)) return window.VoltixCommon.toast('Validation', 'CVV must be at least 3 digits.'); window.VoltixCommon.recordPayment(mode, ch); window.location.href = 'payment-success.html'; });
    document.getElementById('backToSummaryBtn')?.addEventListener('click', () => window.location.href = 'payment.html');
  }
});


