const _ = require('lodash');
const GatewayCallbackServiceBuilder = require('../builders/gatewayCallbackServiceBuilder');
const { Presentation } = require('../../models');
const { Billing, Payment } = require('../../models/schemas');
const { PaymentData, BillingData, PresentationData } = require('../../config/data');
const { FailedChargingPaymentMethodException, BadRequestException, Exception } = require('../../exception');
const PresentationService = require('../presentation/base');

module.exports = class UpdatePaymentStatusService extends PresentationService
{
    /** @param { VendorGatewayCallbackInterface } vendorGatewayCallbackService */
    constructor(data) {
      super(data);

      if (data.id === undefined || data.transaction === undefined) { 
        throw new BadRequestException('Missing required info'); 
      }

      this.id = data.id;
      this.transaction = data.transaction;

      this.payment = {};
      this.presentation = {};
    }

    async update() {
      try {
        await this.searchPresentationFromPayment();
        this.ensurePresentationWasFound()
          .ensurePresentationCanBeUpdated()
          .retrieveTargetPayment()
          .ensurePaymentWasFound()
          .createServiceFromPayment()
          .updatePaymentState()
          .updateBillingState();
  
        await this.savePresentation();
        this.sendStatusUpdateMail();
        return this;

      } catch (error) {
        // Assume payment instance exists
        if (error instanceof FailedChargingPaymentMethodException) { this.sendFailedPaymentMail(); }
        throw error;
      }
    }

    async searchPresentationFromPayment() {
      this.presentation = await Presentation.findOne({ 'billing.payments.id': this.id })
        .populate({ path: 'billing', populate: { path: 'payments' }});

      return this;
    }

    ensurePresentationCanBeUpdated() {
      if (this.presentation.billing.status.includes([BillingData.COMPLETED_STATUS])) {
        throw new Exception('Presentation already paid');
      }

      return this;
    }

    retrieveTargetPayment() {
      this.payment = _.find(this.presentation.billing.payments, (payment) => payment.id = this.id);
      return this;
    }

    ensurePaymentWasFound() {
      if (this.payment === undefined || ! this.payment instanceof Payment) {
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

      if (this.payment.status === PaymentData.PAYMENT_STATUS_FAILED) {
        throw new FailedChargingPaymentMethodException();
      }

      return this;
    }

    updateBillingState() {
      this.presentation.billing.total_paid += this.payment.net_amount;

      if (this.presentation.billing.is_fully_paid) {
        this.presentation.billing.status = BillingData.COMPLETED_STATUS
      }

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