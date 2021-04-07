const { CancelOverduePaymentsScriptService } = require('../services/billing');

console.log('Starting cancel overdue payments script');

(async () => {
  const cancelOverduePaymentsSvc = new CancelOverduePaymentsScriptService();
  await cancelOverduePaymentsSvc.run();
})();
