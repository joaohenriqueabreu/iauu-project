const _                             = require('lodash');
const GatewayCallbackServiceBuilder = require('../builders/gatewayCallbackServiceBuilder');
const { Billing }                   = require('../../models');
const { Payment }                   = require('../../models/schemas');
const { BillingData }               = require('../../config/data');
const { EVENTS }                    = require('lib/events');
const { FailedChargingPaymentMethodException, BadRequestException, Exception } = require('../../exception');
const SaveBillingService = require('./saveBilling');

module.exports = class UpdatePaymentStatusService extends SaveBillingService
{
    /** @param { VendorGatewayCallbackInterface } vendorGatewayCallbackService */
    constructor(id) {
      super(id);

      this.id      = id;

      this.payment = {};
      this.billing = {};
    }

    async update(transaction) {
      this.transaction = transaction;

      try {
        await this.searchBillingFromPayment();
        this.ensureBillingWasFound()
          .ensureBillingCanBeUpdated()
          .retrieveTargetPayment()
          .ensurePaymentWasFound()
          .createServiceFromPayment()
          .updatePaymentState()
          .updateBillingState();
  
        await this.saveBilling();
        this.updatePresentationState()
          .sendStatusUpdateMail();

        return this;

      } catch (error) {
        // Assume payment instance exists
        if (error instanceof FailedChargingPaymentMethodException) { this.sendFailedPaymentMail(); }
        throw error;
      }
    }

    async searchBillingFromPayment() {
      this.billing = await Billing.findOne({ 'payments.id': this.id });
      return this;
    }

    ensureBillingWasFound() {
      if (Billing.notFound(this.billing)) { 
        throw new BadRequestException('Invalid payment provided');
      }

      return this;
    }

    ensureBillingCanBeUpdated() {
      if (this.billing.is_fully_paid) {
        throw new Exception('Billing already paid');
      }

      return this;
    }

    retrieveTargetPayment() {
      this.payment = _.find(this.billing.payments, (payment) => payment.id = this.id);
      return this;
    }

    ensurePaymentWasFound() {
      if (Payment.notFound(this.payment)) {
        throw new BadRequestException('Failed retrieving payment data');
      }

      return this;
    }

    createServiceFromPayment() {
      this.vendorGatewayCallbackService = (new GatewayCallbackServiceBuilder(this.payment)).getService();
      return this;
    }

    updatePaymentState() {
      this.payment = this.vendorGatewayCallbackService.update(this.transaction);

      if (this.payment.is_failed) {
        throw new FailedChargingPaymentMethodException();
      }

      return this;
    }

    updateBillingState() {
      this.billing.total_paid += this.payment.net_amount;

      if (this.billing.is_fully_paid) {
        this.billing.status = BillingData.COMPLETED_STATUS;
      }

      return this;
    }

    updatePresentationState() {
      if (! this.billing.is_fully_paid) { return this; }

      // no need to await
      this.emitEvent(EVENTS.BILLING_PAID_EVENT, this.billing);      
      return this;
    }

    async sendStatusUpdateMail() {
      return this;
    }

    async sendFailedPaymentMail() {
      return this;
    }

    async sendSuccessUpdateMail() {
      return this;
    }
}