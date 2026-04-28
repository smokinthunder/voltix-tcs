document.addEventListener('DOMContentLoaded', () => {
  const user = window.VoltixCommon?.ensureRole('Customer');
  if (!user) return;

  const bills = window.VoltixCommon?.getBills?.() || [];
  const pending = bills.filter(b => ['Pending', 'Overdue'].includes(b.status));
  const currentBill = pending[0] || bills[0] || null;

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  const setHTML = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = value;
  };

  // Summary card
  setText(
    'summaryPendingCount',
    `${pending.length} Pending Bill${pending.length === 1 ? '' : 's'}`
  );
  setText('summaryAccountNo', user.accountNo || '-');
  setText('summaryServiceType', user.serviceType || '-');
  setText('summaryDueDate', currentBill?.dueDate || '-');

  // Stats
  setText(
    'statCurrentDue',
    window.VoltixCommon?.currency?.(
      pending.reduce((sum, bill) => sum + (bill.amount || 0), 0)
    ) || '₹0'
  );
  setText('statUnits', `${currentBill?.units || 0} kWh`);
  setText('statPeriod', currentBill?.period || currentBill?.month || '-');

  // Build usage data:
  // 1) Prefer window.VoltixData.usage if available
  // 2) Otherwise derive from bills
  let usageData = [];

  if (Array.isArray(window.VoltixData?.usage) && window.VoltixData.usage.length) {
    usageData = window.VoltixData.usage.map(item => ({
      month: item.month,
      value: Number(item.value) || 0
    }));
  } else if (bills.length) {
    usageData = bills.map(bill => ({
      month: bill.month || bill.period || 'Month',
      value: Number(bill.units) || 0
    }));
  }

  // Render usage graph
  const maxUsage = Math.max(...usageData.map(item => item.value || 0), 1);

  setHTML(
    'usageBars',
    usageData.length
      ? usageData
          .map(item => {
            const width = Math.max((item.value / maxUsage) * 100, 8);

            return `
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="small-meta">${item.month}</span>
                  <strong>${item.value} kWh</strong>
                </div>
                <div
                  style="
                    width: 100%;
                    height: 10px;
                    border-radius: 999px;
                    background: rgba(255,255,255,0.08);
                    overflow: hidden;
                  "
                >
                  <div
                    style="
                      width: ${width}%;
                      height: 100%;
                      border-radius: 999px;

    background: #fa6e43;
                    "
                  ></div>
                </div>
              </div>
            `;
          })
          .join('')
      : `<p class="mb-0 text-secondary">No usage data available.</p>`
  );

  // Pay button
  const payPendingBillBtn = document.getElementById('payPendingBillBtn');
  if (payPendingBillBtn) {
    payPendingBillBtn.addEventListener('click', () => {
      if (!pending.length) {
        return window.VoltixCommon?.toast?.(
          'All caught up',
          'There are no pending bills.'
        );
      }

      window.VoltixCommon?.setSelectedBills?.([pending[0].id]);
      window.location.href = 'payment.html';
    });
  }
});

