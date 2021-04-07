const _ = require('lodash');
const moment = require('moment');
const config = require('lib/env');
const BaseService = require('../base');
const GatewaySplitPaymentServiceBuilder = require('../builders/gatewaySplitPaymentServiceBuilder');
const { Billing } = require('src/models');
const { Payment } = require('../../models/schemas');
const { BadRequestException, ManualPaymentRequiredException, Exception } = require('../../exception');

module.exports = class PaymentService extends BaseService
{
    /** @param { VendorGatewayInterface } vendorGatewayService */
    constructor(user, id, paymentMethod, fee) {
      super(user);

      this.id = id;
      this.paymentMethod = paymentMethod;
      this.fee = fee; // optional

      this.splitPaymentService = (new GatewaySplitPaymentServiceBuilder(this.paymentMethod)).getService();
      this.billing = {};
    }

    async pay() {
      await this.searchBilling();
      this.ensureBillingWasFound()
        .ensureBillingIsPayable()
        .createPayment()
        .assignPaymentParties()
        .calculatePaymentAmounts();

      await this.chargeGatewayPayment();
      this.updatePaymentDueDt().
        linkBillingAndPayment();

      await this.saveBilling();

      this.sendPaymentSuccessMails()
        .createPaymentNotifications();

      return this;
    }

    async searchBilling() {
      this.billing = await Billing.findById(this.id).populate('artist').populate('contractor');
      return this;
    }

    ensureBillingWasFound() {
      if (Billing.notFound(this.billing) || !this.billing instanceof Billing) {
        throw new BadRequestException('Invalid Billing provided');
      }

      return this;
    }

    ensureBillingIsPayable() {
      if (! this.billing.is_pending) {
        throw new BadRequestException('Presentation already has an initiated payment in process'); 
      }

      if (! this.billing.has_amount_due) {
        throw new Exception('Presentation has no amount due payment');
      }

      if (this.billing.amount_due <= 0) {
        throw new Exception('Presentation fully paid');
      }

      if (typeof this.billing.artist.account.gateway !== 'object') {
        throw new ManualPaymentRequiredException('Artist dont have receiving account setup, please proceed with manual payment.');
      }

      if (this.billing.fee === undefined) {
        throw new ManualPaymentRequiredException('Presentation has an invalid transaction fee, please proceed with manual payment.');
      }

      return this;
    }

    createPayment() {
      this.payment = new Payment();
      this.payment.method = this.paymentMethod;
      return this;
    }

    assignPaymentParties() {
      this.payment.to = this.billing.artist;
      this.payment.from = this.billing.contractor;
      return this;
    }

    calculatePaymentAmounts() {
      this.payment.fee = this.billing.fee;
      this.payment.amount = this.billing.amount_due;
      this.payment.net_amount = this.billing.amount_due * (1 - this.billing.fee);
      
      return this;
    }

    async chargeGatewayPayment() {
      this.payment.transaction = await this.splitPaymentService.charge(this.payment);
      return this;
    }

    updatePaymentDueDt() {
      this.payment.due_at = moment(this.payment.transaction_due_at).format(config.format.date);
      return this;
    }

    linkBillingAndPayment() {
      this.billing.payments.push(this.payment);
      return this;
    }

    async saveBilling() {
      await this.billing.save();
      return this;
    }

    sendPaymentSuccessMails() {
      return this;
    }

    async sendPaymentFailedMails() {
      return this;
    }

    createPaymentNotifications() {
      return this;
    }

    getBilling() {
      return this.billing;
    }

    getPayment() {
      return this.payment;
    }
}