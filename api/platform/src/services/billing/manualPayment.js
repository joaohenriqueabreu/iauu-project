const { PaymentData } = require('../../config/data');
const UpdatePaymentStatusService = require('./updatePaymentStatus');

module.exports = class ManualBillingPaymentService extends UpdatePaymentStatusService {
  constructor(id) {
    super(id);
  }

  createServiceFromPayment() { return this; } // Don't need to go over pagar.me layer

  updatePaymentState() {
    this.payment.status = PaymentData.PAYMENT_STATUS_COMPLETED;
  }
}