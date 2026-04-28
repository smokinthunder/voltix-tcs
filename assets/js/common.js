window.VoltixCommon = (function () {
  const KEYS = {
    users: 'voltix_users', currentUser: 'voltix_current_user', bills: 'voltix_bills', selectedBills: 'voltix_selected_bills', complaints: 'voltix_complaints', transactions: 'voltix_transactions', lastRegistration: 'voltix_last_registration', lastComplaint: 'voltix_last_complaint', lastReceipt: 'voltix_last_receipt'
  };

  function read(key, fallback) { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } }
  function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  function currency(amount) { return new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(amount || 0); }
  function initials(name) { return (name || 'VT').split(' ').filter(Boolean).slice(0,2).map(v => v[0].toUpperCase()).join(''); }
  function todayString() { return new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }); }
  function nowString() { return new Date().toLocaleString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }); }
  function generateId(prefix) { return `${prefix}-${Math.floor(1000 + Math.random()*9000)}`; }
  function generateCustomerId() { return String(Math.floor(1000000000000 + Math.random()*9000000000000)); }
  function escapeHtml(str) { return String(str ?? '').replace(/[&<>\"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s])); }

  function getUsers() { return read(KEYS.users, []); }
  function saveUsers(users) { write(KEYS.users, users); }
  function getBills() { return read(KEYS.bills, []); }
  function saveBills(items) { write(KEYS.bills, items); }
  function getComplaints() { return read(KEYS.complaints, []); }
  function saveComplaints(items) { write(KEYS.complaints, items); }
  function getTransactions() { return read(KEYS.transactions, []); }
  function saveTransactions(items) { write(KEYS.transactions, items); }
  function getCurrentUser() { return read(KEYS.currentUser, null); }
  function setCurrentUser(user) { write(KEYS.currentUser, user); }

  function ensureDefaultUsers() {
    const existing = getUsers();
    const defaults = [window.VoltixData.adminUser, window.VoltixData.demoUser];
    const merged = [...existing];
    defaults.forEach(def => {
      const exists = merged.find(u => (u.userId || '').toLowerCase() === (def.userId || '').toLowerCase());
      if (!exists) merged.push(def);
    });
    saveUsers(merged);
  }

  function init() {
    ensureDefaultUsers();
    if (!getBills().length) saveBills(window.VoltixData.seedBills);
    if (!getComplaints().length) saveComplaints(window.VoltixData.seedComplaints);
    if (!getTransactions()) saveTransactions([]);
    if (!read(KEYS.selectedBills, null)) write(KEYS.selectedBills, getBills().filter(b => ['Pending','Overdue'].includes(b.status)).slice(0,1).map(b => b.id));
  }

  function login(userId, password) {
    const user = getUsers().find(u => u.userId === userId && u.password === password);
    if (!user) return { ok:false, message:'Invalid User ID or Password.' };
    setCurrentUser(user); return { ok:true, user };
  }
  function logout() { localStorage.removeItem(KEYS.currentUser); window.location.href = 'index.html'; }
  function ensureAuth() { const u = getCurrentUser(); if (!u) { window.location.href = 'index.html'; return null; } return u; }
  function ensureRole(role) { const u = ensureAuth(); if (!u) return null; if (u.role !== role) { window.location.href = u.role === 'Admin' ? 'admin-dashboard.html' : 'dashboard.html'; return null; } return u; }

  function registerUser(payload) {
    const users = getUsers();
    if (users.some(u => u.userId.toLowerCase() === payload.userId.toLowerCase())) return { ok:false, message:'User ID already exists. Please choose another one.' };
    const user = { ...payload, customerId: generateCustomerId(), role:'Customer', serviceType:'Domestic', accountNo:`EB-${payload.billNumber}-${payload.consumerId.slice(-3)}`, address:'Updated by customer' };
    users.push(user); saveUsers(users); write(KEYS.lastRegistration, user); return { ok:true, user };
  }
  function getLastRegistration() { return read(KEYS.lastRegistration, null); }

  function setSelectedBills(ids) { write(KEYS.selectedBills, ids); }
  function getSelectedBills() { return read(KEYS.selectedBills, []); }
  function getSelectedBillObjects() { const ids = getSelectedBills(); return getBills().filter(b => ids.includes(b.id)); }
  function getPendingBills() { return getBills().filter(b => ['Pending','Overdue'].includes(b.status)); }
  function computePaymentSummary() { const selected = getSelectedBillObjects(); const billAmount = selected.reduce((s,b)=>s + Number(b.amount || 0), 0); const pgCharge = selected.length ? Math.round(billAmount * 0.015) : 0; return { selected, billAmount, pgCharge, total: billAmount + pgCharge }; }

  function recordPayment(mode, cardHolderName) {
    const summary = computePaymentSummary();
    const user = getCurrentUser() || window.VoltixData.demoUser;
    const txn = { transactionId: generateId('TXN'), receiptId: generateId('RCPT'), customerName:user.name, customerId:user.customerId || user.consumerId, email:user.email, mode, cardHolderName, dateTime:nowString(), billIds:summary.selected.map(b=>b.id), billAmount:summary.billAmount, pgCharge:summary.pgCharge, totalPaid:summary.total };
    const bills = getBills().map(b => summary.selected.some(sel => sel.id === b.id) ? { ...b, status:'Paid', paidOn: todayString() } : b);
    saveBills(bills);
    const txns = getTransactions(); txns.unshift(txn); saveTransactions(txns);
    write(KEYS.lastReceipt, txn); write(KEYS.selectedBills, []); return txn;
  }
  function getLastReceipt() { return read(KEYS.lastReceipt, null); }
  function receiptText(txn) { if (!txn) return 'No receipt generated.'; return ['VOLTIX ELECTRICITY BILLING RECEIPT','=================================',`Receipt ID      : ${txn.receiptId}`,`Transaction ID  : ${txn.transactionId}`,`Customer Name   : ${txn.customerName}`,`Customer ID     : ${txn.customerId}`,`Email           : ${txn.email}`,`Payment Mode    : ${txn.mode}`,`Card Holder     : ${txn.cardHolderName}`,`Date/Time       : ${txn.dateTime}`,`Bill Amount     : ${currency(txn.billAmount)}`,`PG Charge       : ${currency(txn.pgCharge)}`,`Total Paid      : ${currency(txn.totalPaid)}`,`Bills Covered   : ${txn.billIds.join(', ')}`,'','Status          : SUCCESS','Thank you for using Voltix.'].join('\n'); }
  function downloadTextFile(filename, content) { const blob = new Blob([content], { type:'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }

  function addComplaint(payload) { const user = getCurrentUser() || window.VoltixData.demoUser; const items = getComplaints(); const item = { id: generateId('CMP'), status:'Open', createdAt:todayString(), customerName:user.name, ...payload }; items.unshift(item); saveComplaints(items); write(KEYS.lastComplaint, item); return item; }
  function updateComplaintStatus(id, status) { saveComplaints(getComplaints().map(c => c.id === id ? { ...c, status } : c)); }
  function getLastComplaint() { return read(KEYS.lastComplaint, null); }

  function toast(title, body) {
    const zone = document.getElementById('toast-zone') || (() => { const z = document.createElement('div'); z.id = 'toast-zone'; z.className = 'toast-zone'; document.body.appendChild(z); return z; })();
    const node = document.createElement('div'); node.className = 'toast custom-toast show';
    node.innerHTML = `<div class="toast-header"><i class="bi bi-lightning-charge-fill text-accent me-2"></i><strong class="me-auto">${escapeHtml(title)}</strong><button type="button" class="btn-close btn-close-white ms-2 mb-1" aria-label="Close"></button></div><div class="toast-body">${escapeHtml(body)}</div>`;
    zone.appendChild(node); node.querySelector('.btn-close').addEventListener('click', () => node.remove()); setTimeout(() => node.remove(), 3500);
  }

  return { init, currency, initials, generateId, generateCustomerId, todayString, nowString, escapeHtml, getUsers, saveUsers, getBills, saveBills, getComplaints, saveComplaints, getTransactions, saveTransactions, getCurrentUser, setCurrentUser, login, logout, ensureAuth, ensureRole, registerUser, getLastRegistration, setSelectedBills, getSelectedBills, getSelectedBillObjects, getPendingBills, computePaymentSummary, recordPayment, getLastReceipt, receiptText, downloadTextFile, addComplaint, updateComplaintStatus, getLastComplaint, toast };
})();
window.VoltixCommon.init();


