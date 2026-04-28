document.addEventListener('DOMContentLoaded', () => {
  const user = window.VoltixCommon.ensureRole('Customer'); if (!user) return;
  const body = document.getElementById('complaintStatusBody'); const search = document.getElementById('complaintSearch'); const count = document.getElementById('complaintCount');
  function render() { const q = search.value.trim().toLowerCase(); const rows = window.VoltixCommon.getComplaints().filter(c => c.consumerNo === (user.consumerId || user.customerId)).filter(c => `${c.id} ${c.type} ${c.category} ${c.status}`.toLowerCase().includes(q)); count.textContent = `${rows.length} complaint${rows.length === 1 ? '' : 's'} found`; body.innerHTML = rows.length ? rows.map((c,i) => `<tr><td>${i+1}</td><td>${c.id}</td><td>${c.type}</td><td>${c.category}</td><td>${c.createdAt}</td><td><span class="soft-badge ${c.status === 'Resolved' ? 'paid-badge' : c.status === 'In Progress' ? 'progress-badge' : 'pending-badge'}">${c.status}</span></td><td>${c.description}</td></tr>`).join('') : '<tr><td colspan="7"><div class="empty-state">No complaints matched your search.</div></td></tr>'; }
  search.addEventListener('input', render); render();
});


