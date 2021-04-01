const _ = require('lodash');
const PaymentService = require('./payment');
const { Billing, Instalment, Payment } = require('../../models/schemas');
const { BadRequestException, ManualPaymentRequiredException, Exception } = require('../../exception');

module.exports = class PayInstalmentPaymentService extends PaymentService
{
    async searchBilling() {
      this.billing = await Billing.findOne({ 'instalments.id': this.id });
      this.instalment = _.filter(this.billing.installments, (instalment) => instalment.id === this.id)[0];
      return this;
    }

    createPayment() {
      this.payment = new Payment();
      this.payment.method = this.paymentMethod;
      this.payment.instalment = this.instalment.id;
      return this;
    }

    calculatePaymentAmounts() {
      this.payment.fee = this.billing.fee;
      this.payment.amount = this.instalment.amount;
      this.payment.net_amount = this.instalment.total_amount * (1 - this.billing.fee);
      
      return this;
    }
}