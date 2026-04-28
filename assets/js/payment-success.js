document.addEventListener('DOMContentLoaded', () => {
  const user = window.VoltixCommon.ensureRole('Customer'); if (!user) return;
  const txn = window.VoltixCommon.getLastReceipt();
  if (!txn) { document.getElementById('paymentDetails').innerHTML = '<div class="empty-state">No recent transaction found.</div>'; return; }
  document.getElementById('paymentDetails').innerHTML = `<div class="alert alert-success-soft mb-4"><i class="bi bi-check-circle-fill me-2"></i><strong>Payment completed successfully.</strong></div><div class="bill-breakdown"><div class="bill-item"><span>Transaction ID</span><strong>${txn.transactionId}</strong></div><div class="bill-item"><span>Receipt ID</span><strong>${txn.receiptId}</strong></div><div class="bill-item"><span>Customer Name</span><strong>${txn.customerName}</strong></div><div class="bill-item"><span>Payment Mode</span><strong>${txn.mode}</strong></div><div class="bill-item"><span>Total Paid</span><strong>${window.VoltixCommon.currency(txn.totalPaid)}</strong></div><div class="bill-item"><span>Paid On</span><strong>${txn.dateTime}</strong></div></div>`;
  const text = window.VoltixCommon.receiptText(txn); document.getElementById('receiptPreview').textContent = text; document.getElementById('downloadReceiptBtn')?.addEventListener('click', () => window.VoltixCommon.downloadTextFile(`${txn.receiptId}.txt`, text));
});


