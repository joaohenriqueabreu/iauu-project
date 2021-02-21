const _ = require('lodash');
const PresentationService = require('../presentation/base');
const GatewayServiceBuilder = require('../builders/gatewayServiceBuilder');
const { Invoice, Payment } = require('../../models/schemas');
const { PaymentData } = require('../../config/data');
const { BadRequestException, ManualPaymentRequiredException } = require('../../exception');

class PayPresentationService extends PresentationService
{
    /** @param { VendorGatewayInterface } vendorGatewayService */
    constructor(user, data) {
      super(user, data);

      if (data.id === undefined) { throw new BadRequestException('Missing presentation info'); }
      if (data.paymentMethod === undefined) { throw new BadRequestException('Payment method missing'); }

      this.id = data.id;
      this.fee = data.fee; // optional

      this.vendorGatewayService = (new GatewayServiceBuilder(data.paymentMethod)).getService();

      this.invoice = {};
      this.payments = [];
    }

    async pay() {
      await this.searchPresentation();
      this.ensurePresentationWasFound()
        .ensurePresentationIsPayable()
        .createInvoice()
        .ensureAmountIsValid()
        .createPayments()
        .assignPaymentParties()
        .calculatePaymentAmounts();

        // TODO will hold off referrals for now
        // .calculateReferralAmounts()
        // .queuePayments();

      await this.chargeGatewayPayments();
      this.updateTransactionData()
        .linkPresentationInvoiceAndPayments();
      await this.savePresentation();
        
      this.sendPaymentSuccessMails();
      return this;
    }

    ensurePresentationIsPayable() {
      if (! this.presentation.isCompleted()) { 
        throw new Error('Presentation is not in payable state.'); 
      }

      if (typeof this.presentation.invoice === 'object') {
        throw new Error('Presentation already has an initiated payment processing'); 
      }

      if (typeof this.presentation.contractor.account.gateway !== 'object') {
          throw new ManualPaymentRequiredException('Contractor dont have receiving account setup, please proceed with manual payment.');
        }

      return this;
    }

    createInvoice() {
      this.invoice = new Invoice({
        total_amount: this.presentation.price,
        fee: this.fee ? this.fee : this.presentation.fee,
        status: 'pending'
      });

      return this;
    }

    ensureAmountIsValid() {
      if (this.invoice.total_amount <= 0) {
        throw new Error('Invoiced amount cannot be zero');
      }

      return this;
    }

    createPayments() {
      // Artist payment
      this.artistPayment = new Payment({});
      this.ourPayment = new Payment({});

      // TODO Will hold off referrals for now - implement
      // this.referralPayments = new Payment({});

      this.payments.push([this.artistPayment, this.ourPayment]);
      return this;
    }

    assignPaymentParties() {
      this.ourPayment.to = PaymentData.OUR_COMPANY_ARTIST_RECORD;
      this.ourPayment.from = this.presentation.contractor;

      this.artistPayment.to = this.presentation.artist;
      this.artistPayment.from = this.presentation.contractor;
      return this;
    }

    calculatePaymentAmounts() {
      this.ourPayment.amount = this.invoice.total_amount * this.invoice.fee;
      this.artistPayment.amount = this.invoice.total_amount - this.ourPayment;
      return this;
    }

    // TODO Will hold off referrals for now - implement
    // calculateReferralAmounts() {
    //   return this;
    // }

    // queuePayments() {
    //   // Flatten payments (as referrals could be an array)
    //   this.payments = _.flatten(this.payments);
    //   return this;
    // }

    async chargeGatewayPayments() {
      for (let i=0; i < this.payments.length; i++) {
        const paymentToPay = this.payments[i];
        paymentToPay.transaction = await this.vendorGatewayService.charge(paymentToPay);
      }

      return this;
    }

    updateTransactionData() {
      return this;
    }

    linkPresentationInvoiceAndPayments() {
      this.invoice.payments = this.payments;
      this.presentation.invoice = this.invoice;
      return this;
    }

    async sendPaymentSuccessMails() {
      return this;
    }

    async sendPaymentFailedMails() {
      return this;
    }
}

module.exports = PayPresentationService;