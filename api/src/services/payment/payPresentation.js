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
      this.paymentMethod = data.paymentMethod;

      this.vendorGatewayService = (new GatewayServiceBuilder(this.paymentMethod)).getService();

      this.invoice = {};
    }

    async pay() {
      await this.searchPresentation();
      this.ensurePresentationWasFound()
        .ensurePresentationIsPayable()
        .createInvoice()
        .calculateTransactionFee()
        .ensureAmountIsValid()
        .createPayment() // TODO we might come up with a way of making multiple payments
        .assignPaymentParties()
        .calculatePaymentAmounts();

        // TODO will hold off referrals for now
        // .calculateReferralAmounts()
        // .queuePayments();

      await this.chargeGatewayPayment();
      this.linkPresentationInvoiceAndPayments();
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

      if (this.presentation.fee === undefined) {
        throw new ManualPaymentRequiredException('Presentation has an invalid transaction fee, please proceed with manual payment.');
      }

      return this;
    }

    createInvoice() {
      this.invoice = new Invoice({
        total_amount: this.presentation.price,
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

    calculateTransactionFee() {
      this.invoice.fee = this.fee !== undefined ? this.fee : this.presentation.fee;
      return this;
    }

    createPayment() {
      // Artist payment
      this.artistPayment = new Payment({ });
      this.artistPayment.method = this.paymentMethod;

      // TODO Will hold off referrals for now - implement
      // this.referralPayments = new Payment({});

      return this;
    }

    assignPaymentParties() {
      this.artistPayment.to = this.presentation.artist.id;
      this.artistPayment.from = this.presentation.contractor.id;
      return this;
    }

    calculatePaymentAmounts() {
      this.artistPayment.fee = this.invoice.fee;
      this.artistPayment.amount = this.invoice.total_amount;
      this.artistPayment.net_amount = this.invoice.total_amount * (1 - this.invoice.fee);
      
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

    async chargeGatewayPayment() {
      this.artistPayment.transaction = await this.vendorGatewayService.charge(this.artistPayment);
      return this;
    }

    linkPresentationInvoiceAndPayments() {
      this.invoice.payments.push(this.artistPayment);
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