const _ = require('lodash');
const PaymentService = require('./payment');
const { Billing } = require('../../models');
const { Instalment, Payment } = require('../../models/schemas');
const { BadRequestException, ManualPaymentRequiredException, Exception } = require('../../exception');

module.exports = class PayInstalmentPaymentService extends PaymentService
{
  constructor(user, id, paymentMethod, fee, instalmentId) {
    super(user, id, paymentMethod, fee);

    this.instalmentId     = instalmentId;
    this.instalmentIndex  = null;
  }

  /** PaymentService overrides */
  async searchBilling() {
    await super.searchBilling();

    this.instalmentIndex  = this.getInstalmentIndex();
    this.instalment       = this.billing.instalments[this.instalmentIndex];
    return this;
  }

  ensureBillingWasFound() {
    if (Instalment.notFound(this.instalment)) {
      throw new BadRequestException('Instalment not found');
    }

    return super.ensureBillingWasFound();
  }

  ensureBillingIsPayable() {
    if (this.instalment.is_paid) {
      throw new BadRequestException('Instalment already paid');
    }

    return super.ensureBillingIsPayable();
  }

  createPayment() {
    console.log('Creating payment for instalment...');
    this.payment                = new Payment();
    this.payment.method         = this.paymentMethod;
    this.payment.instalment_id  = this.instalment.id;
    return this;
  }

  calculatePaymentAmounts() {
    this.payment.fee        = this.billing.fee;
    this.payment.amount     = this.instalment.amount;
    this.payment.net_amount = this.instalment.amount * (1 - this.billing.fee);
    
    return this;
  }

  updateBillingStatus() {
    this.instalment.status = 'paid';
    return this;
  }

  linkBillingAndPayment() {
    this.billing.instalments[this.instalmentIndex] = this.instalment;
    return super.linkBillingAndPayment();
  }

  getInstalmentIndex() {
    return _.findIndex(this.billing.instalments, (instalment) => instalment.id === this.instalmentId);
  }
}