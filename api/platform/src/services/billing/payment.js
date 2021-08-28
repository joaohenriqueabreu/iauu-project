const _                       = require('lodash');
const moment                  = require('moment');
const config                  = require('@iauu/env');
const BaseService             = require('../base');
const { Billing }             = require('../../models');
const { Payment }             = require('../../models/schemas');
const { DataRequestService }  = require('@iauu/services');
const GatewaySplitPaymentServiceBuilder = require('../builders/gatewaySplitPaymentServiceBuilder');
const { BadRequestException, ManualPaymentRequiredException, Exception } = require('../../exception');

module.exports = class PaymentService extends BaseService
{
    /** @param { VendorGatewayInterface } vendorGatewayService */
    constructor(user, id, paymentMethod, fee) {
      super(user);

      this.id             = id;
      this.paymentMethod  = paymentMethod;
      this.fee            = fee; // optional

      this.splitPaymentService = (new GatewaySplitPaymentServiceBuilder(this.paymentMethod)).getService();

      this.billing        = {};
      this.artistAccount  = {};
      this.contractor     = {};
    }

    async pay() {
      await this.searchBilling();
      this.ensureBillingWasFound();

      await this.searchBillingParties();
      this.ensurePartiesAreValid()
        .ensureBillingIsPayable()
        .filterRequiredInformation();

      this.createPayment()
        .calculatePaymentAmounts();

      await this.chargeGatewayPayment();
      this.updatePaymentDueDt()
        .updateBillingStatus()
        .linkBillingAndPayment();

      await this.saveBilling();

      this.sendPaymentSuccessMails()
        .createPaymentNotifications();

      return this;
    }

    async searchBilling() {
      this.billing = await Billing.findById(this.id).populate('artist_account');
      return this;
    }

    ensureBillingWasFound() {
      if (Billing.notFound(this.billing) || !this.billing instanceof Billing) {
        throw new BadRequestException('Invalid Billing provided');
      }

      return this;
    }

    async searchBillingParties() {
      this.artistAccount  = this.billing.artist_account;

      try {
        this.contractor = await DataRequestService.getContractor(this.billing.contractor_id);
      } catch (error) {
        console.log(error);
        throw new BadRequestException('Contractor not found');
      }
      
      return this;
    }

    ensurePartiesAreValid() {
      if (this.artistAccount == null || this.contractor == null) {
        throw new BadRequestException('Artist or Contractor provided not found');
      }

      // TODO Other validations for requesting payment
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

      if (typeof this.artistAccount.account.gateway !== 'object') {
        throw new ManualPaymentRequiredException('Artist dont have receiving account setup, please proceed with manual payment.');
      }

      if (this.billing.fee === undefined) {
        throw new ManualPaymentRequiredException('Presentation has an invalid transaction fee, please proceed with manual payment.');
      }

      return this;
    }

    filterRequiredInformation() {
      return this;
    }

    createPayment() {
      this.payment        = new Payment();
      this.payment.method = this.paymentMethod;
      return this;
    }

    calculatePaymentAmounts() {
      this.payment.fee        = this.billing.fee;
      this.payment.amount     = this.billing.amount_due;
      this.payment.net_amount = this.billing.amount_due * (1 - this.billing.fee);
      
      return this;
    }

    async chargeGatewayPayment() {
      this.payment.transaction = await this.splitPaymentService.charge(this.payment, this.contractor, this.artistAccount);
      return this;
    }

    updatePaymentDueDt() {
      this.payment.due_dt = moment(this.payment.transaction_due_dt).format(config.format.dbDate);
      return this;
    }

    updateBillingStatus() {
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