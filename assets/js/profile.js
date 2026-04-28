document.addEventListener('DOMContentLoaded', () => {
  const user = window.VoltixCommon.ensureRole('Customer');
  if (!user) return;
  const page = document.body.dataset.page;
  if (page === 'profile') {
    // Populate form with existing user data
    document.getElementById('profCustomerId').value = user.customerId || '';
    document.getElementById('profConsumerId').value = user.consumerId || '';
    document.getElementById('profUserId').value = user.userId || '';
    document.getElementById('profAccountNo').value = user.accountNo || '';
    document.getElementById('profBillNumber').value = user.billNumber || '';
    
    document.getElementById('profName').value = user.name || '';
    document.getElementById('profEmail').value = user.email || '';
    document.getElementById('profMobileCode').value = user.mobileCode || '+91';
    document.getElementById('profMobile').value = user.mobile || '';
    document.getElementById('profAddress').value = user.address || '';
    
    // Handle form submission
    document.getElementById('profileForm')?.addEventListener('submit', e => {
      e.preventDefault();
      
      const mobile = document.getElementById('profMobile').value.trim();
      if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
        return window.VoltixCommon.toast('Validation Error', 'Mobile Number must be 10 digits.');
      }
      
      const updatedUser = {
        ...user,
        name: document.getElementById('profName').value.trim(),
        email: document.getElementById('profEmail').value.trim(),
        mobileCode: document.getElementById('profMobileCode').value.trim(),
        mobile: mobile,
        address: document.getElementById('profAddress').value.trim()
      };
      
      // Update in users array
      const users = window.VoltixCommon.getUsers();
      const idx = users.findIndex(u => u.userId === user.userId);
      if (idx !== -1) {
        users[idx] = updatedUser;
        window.VoltixCommon.saveUsers(users);
      }
      
      // Update current user
      window.VoltixCommon.setCurrentUser(updatedUser);
      window.VoltixCommon.toast('Success', 'Profile updated successfully.');
      
      // Update navbar if name changed
      const navbarAvatar = document.querySelector('.profile-name');
      if (navbarAvatar) {
        navbarAvatar.textContent = `Welcome, ${window.VoltixCommon.escapeHtml(updatedUser.name)}`;
      }
    });
  }
});
