const _ = require('lodash');
const PresentationService = require('../presentation/base');
const GatewaySplitPaymentServiceBuilder = require('../builders/gatewaySplitPaymentServiceBuilder');
const { Invoice, Payment } = require('../../models/schemas');
const { PaymentData } = require('../../config/data');
const { BadRequestException, ManualPaymentRequiredException } = require('../../exception');

class PayPresentationService extends PresentationService
{
    /** @param { VendorGatewayInterface } vendorGatewayService */
    constructor(user, paymentMethod, fee) {
      super(user, paymentMethod, fee);

      if (paymentMethod === undefined) { throw new BadRequestException('Payment method missing'); }

      this.paymentMethod = paymentMethod;
      this.fee = fee; // optional

      this.splitPaymentService = (new GatewaySplitPaymentServiceBuilder(this.paymentMethod)).getService();
      this.invoice = {};
    }

    async pay(id) {
      if (id === undefined) { throw new BadRequestException('Missing presentation info'); }
      this.id = id;

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
      if (! this.presentation.is_completed) { 
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
      this.artistPayment = new Payment();
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
      this.artistPayment.transaction = await this.splitPaymentService.charge(this.artistPayment);
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