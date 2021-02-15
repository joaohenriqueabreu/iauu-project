const _ = require('lodash');
const BaseService = require('../base');
const GatewayPaymentService = require('./gatewayPayment');
const { Payment } = require('../../models');

module.exports = class InitiatePaymentService extends BaseService
{
    constructor(presentation) {
      super();

      this.presentation = presentation;

      this.artistPayment = {};
      this.ourPayment = {};
      this.referralPayments = [];

      this.payments = [this.artistPayment, this.ourPayment, this.referralPayments];
    }

    async initiate() {
      this.ensurePresentationIsPayable()
        .createAndCalculatePaymentFees()
        .createAndCalculateReferralPaymentFees()
        .queuePayments();

      await this.execGatewayPayments();
      await this.savePayments();
        
      this.sendPaymentSuccessMails();
      return this;
    }

    ensurePresentationIsPayable() {
      if (! this.presentation.isCompleted()) { 
        throw new Error('Presentation is not in payable state'); 
      }

      return this;
    }

    createAndCalculatePaymentFees() {
      this.artistPayment = new Payment();
      this.ourPayment = new Payment();

      // Start payment with pending state

      return this;
    }

    createAndCalculateReferralPaymentFees() {
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

    async savePayments() {
      return this;
    }

    async sendPaymentSuccessMails() {
      return this;
    }

    async sendPaymentFailedMails() {
      return this;
    }
}
