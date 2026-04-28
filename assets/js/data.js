window.VoltixData = (function () {
  const titles = ['Mr', 'Ms', 'Mrs', 'Dr'];
  const countryCodes = ['+91', '+971', '+1', '+44', '+65'];
  const complaintCategoryMap = {
    'Billing related': ['Wrong reading', 'Excess amount', 'Meter mismatch', 'Duplicate charge'],
    'Voltage related': ['Low voltage', 'High voltage', 'Frequent fluctuations'],
    'Frequent disruption': ['Area outage', 'Intermittent supply', 'Transformer trip'],
    'Street light related': ['Light not working', 'Always on', 'Damaged fixture'],
    'Pole related': ['Pole damage', 'Cable hanging', 'Unsafe leaning pole'],
    'Service request': ['Name correction', 'Connection transfer', 'Meter shift', 'General assistance']
  };

  const adminUser = { customerId: 'ADMIN-0001', consumerId: '0000000000000', billNumber: '00000', title: 'Mr', name: 'System Administrator', email: 'admin@voltix.local', mobileCode: '+91', mobile: '9999999999', userId: 'admin', password: 'Admin@123', role: 'Admin', serviceType: 'Internal', accountNo: 'ADMIN-PORTAL', address: 'Operations Center' };
  const demoUser = { customerId: '2045800198745', consumerId: '2045800198745', billNumber: '45678', title: 'Mr', name: 'Farhan Faras A', email: 'farhan@example.com', mobileCode: '+91', mobile: '9876543210', userId: 'demoUser', password: 'Demo@123', role: 'Customer', serviceType: 'Domestic', accountNo: 'EB-20458-001', address: 'MG Road, Kochi' };

  const seedBills = [
    { id:'BILL-APR-2026', billNumber:'B20260401', month:'April 2026', period:'01–30 Apr 2026', units:326, fixedCharges:560, energyCharges:1720, tax:200, amount:2480, dueDate:'30 Apr 2026', status:'Pending', paidOn:'', customerName:demoUser.name, accountNo:demoUser.accountNo, consumerNo:demoUser.consumerId },
    { id:'BILL-MAR-2026', billNumber:'B20260301', month:'March 2026', period:'01–31 Mar 2026', units:301, fixedCharges:500, energyCharges:1540, tax:190, amount:2230, dueDate:'02 Apr 2026', status:'Paid', paidOn:'02 Apr 2026', customerName:demoUser.name, accountNo:demoUser.accountNo, consumerNo:demoUser.consumerId },
    { id:'BILL-FEB-2026', billNumber:'B20260201', month:'February 2026', period:'01–28 Feb 2026', units:265, fixedCharges:470, energyCharges:1330, tax:180, amount:1980, dueDate:'03 Mar 2026', status:'Paid', paidOn:'03 Mar 2026', customerName:demoUser.name, accountNo:demoUser.accountNo, consumerNo:demoUser.consumerId },
    { id:'BILL-NOV-2025', billNumber:'B20251101', month:'November 2025', period:'01–30 Nov 2025', units:318, fixedCharges:530, energyCharges:1660, tax:220, amount:2410, dueDate:'30 Nov 2025', status:'Overdue', paidOn:'', customerName:demoUser.name, accountNo:demoUser.accountNo, consumerNo:demoUser.consumerId }
  ];

  const seedComplaints = [
    { id:'CMP-1034', type:'Billing related', category:'Wrong reading', status:'In Progress', description:'Meter reading appears higher than actual consumption.', contactPerson:demoUser.name, landmark:'Near South Railway Station', consumerNo:demoUser.consumerId, mobile:demoUser.mobile, address:demoUser.address, createdAt:'16 Apr 2026', customerName:demoUser.name },
    { id:'CMP-1011', type:'Voltage related', category:'Frequent fluctuations', status:'Resolved', description:'Voltage fluctuation during evenings.', contactPerson:demoUser.name, landmark:'Panampilly Nagar', consumerNo:demoUser.consumerId, mobile:demoUser.mobile, address:demoUser.address, createdAt:'28 Mar 2026', customerName:demoUser.name },
    { id:'CMP-0998', type:'Frequent disruption', category:'Area outage', status:'Open', description:'Repeated outage in the street over the last 3 days.', contactPerson:demoUser.name, landmark:'Kadavanthra Junction', consumerNo:demoUser.consumerId, mobile:demoUser.mobile, address:demoUser.address, createdAt:'11 Mar 2026', customerName:demoUser.name }
  ];

  const usage = [
    { month:'Jan', value:240, width:58 },
    { month:'Feb', value:265, width:64 },
    { month:'Mar', value:301, width:74 },
    { month:'Apr', value:326, width:81, active:true }
  ];

  return { titles, countryCodes, complaintCategoryMap, adminUser, demoUser, seedBills, seedComplaints, usage };
})();


