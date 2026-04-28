document.addEventListener('DOMContentLoaded', () => {
  const user = window.VoltixCommon.ensureRole('Customer'); if (!user) return;
  const page = document.body.dataset.page;
  if (page === 'complaint') {
    const type = document.getElementById('complaintType'); const cat = document.getElementById('complaintCategory');
    Object.keys(window.VoltixData.complaintCategoryMap).forEach(k => type.insertAdjacentHTML('beforeend', `<option value="${k}">${k}</option>`));
    const sync = () => { cat.innerHTML = (window.VoltixData.complaintCategoryMap[type.value] || []).map(v => `<option value="${v}">${v}</option>`).join(''); };
    type.addEventListener('change', sync); sync();
    document.getElementById('contactPerson').value = user.name; document.getElementById('consumerNo').value = user.consumerId || user.customerId; document.getElementById('complaintMobile').value = user.mobile || ''; document.getElementById('complaintAddress').value = user.address || '';
    document.getElementById('complaintPreviewList').innerHTML = window.VoltixCommon.getComplaints().filter(c => c.consumerNo === (user.consumerId || user.customerId)).slice(0,3).map(c => `<div class="complaint-item"><div class="complaint-icon"><i class="bi bi-tools"></i></div><div class="complaint-content"><div class="d-flex justify-content-between align-items-start gap-3"><div><h6>${c.type}</h6><p>${c.id} • ${c.category}</p></div><span class="soft-badge ${c.status === 'Resolved' ? 'paid-badge' : c.status === 'In Progress' ? 'progress-badge' : 'pending-badge'}">${c.status}</span></div></div></div>`).join('');
    document.getElementById('complaintForm')?.addEventListener('submit', e => { e.preventDefault(); const payload = { type:type.value, category:cat.value, contactPerson:document.getElementById('contactPerson').value.trim(), landmark:document.getElementById('landmark').value.trim(), consumerNo:document.getElementById('consumerNo').value.trim(), description:document.getElementById('problemDescription').value.trim(), mobile:document.getElementById('complaintMobile').value.trim(), address:document.getElementById('complaintAddress').value.trim() }; if (payload.consumerNo.length !== 13) return window.VoltixCommon.toast('Validation', 'Consumer No must be 13 digits.'); if (payload.mobile.length !== 10) return window.VoltixCommon.toast('Validation', 'Mobile Number must be 10 digits.'); window.VoltixCommon.addComplaint(payload); window.location.href='complaint-success.html'; });
    document.getElementById('cancelComplaintBtn')?.addEventListener('click', () => document.getElementById('complaintForm').reset());
  }
  if (page === 'complaint-success') {
    const c = window.VoltixCommon.getLastComplaint(); const root = document.getElementById('complaintAck'); if (!c) { root.innerHTML = '<div class="empty-state">No recent complaint found.</div>'; return; }
    root.innerHTML = `<div class="alert alert-success-soft mb-4"><i class="bi bi-check-circle-fill me-2"></i><strong>Complaint registered successfully.</strong></div><div class="bill-breakdown"><div class="bill-item"><span>Complaint ID</span><strong>${c.id}</strong></div><div class="bill-item"><span>Complaint Type</span><strong>${c.type}</strong></div><div class="bill-item"><span>Category</span><strong>${c.category}</strong></div><div class="bill-item"><span>Status</span><strong>${c.status}</strong></div></div>`;
  }
});


