const _ = require('lodash');
const PresentationService = require('../presentation/base');
const GatewayPaymentService = require('./gatewayPayment');
const { Invoice, Payment } = require('../../models/schemas');

class InitiatePaymentService extends PresentationService
{
    constructor(user, data) {
      super(user, data);

      this.id = data.id;
      this.fee = data.fee;

      this.invoice = {};
      this.payments = [];
    }

    async initiate() {
      await this.searchPresentation();
      this.ensurePresentationWasFound()
        .ensurePresentationIsPayable()
        .createInvoice()
        .createPayments()
        .calculatePaymentAmounts()
        .calculateReferralAmounts()
        .queuePayments();

      await this.execGatewayPayments();
      this.updateTransactionData()
        .linkPresentationInvoiceAndPayments();
      await this.savePresentation();
        
      this.sendPaymentSuccessMails();
      return this;
    }

    ensurePresentationIsPayable() {
      if (! this.presentation.isCompleted()) { 
        throw new Error('Presentation is not in payable state'); 
      }

      if (typeof this.presentation.invoice === 'object') {
        throw new Error('Presentation already has an initiated payment processing'); 
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

    createPayments() {
      // Artist payment
      this.artistPayment = new Payment({});
      this.ourPayment = new Payment({});
      this.referralPayments = new Payment({});

      this.payments.push([this.artistPayment, this.ourPayment, this.referralPayments]);
      return this;
    }

    calculatePaymentAmounts() {
      return this;
    }

    calculateReferralAmounts() {
      return this;
    }

    queuePayments() {
      // Flatten payments (as referrals could be an array)
      this.payments = _.flatten(this.payments);
      return this;
    }

    async execGatewayPayments() {
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

module.exports = InitiatePaymentService;