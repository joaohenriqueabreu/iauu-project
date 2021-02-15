const _ = require('lodash');
const PresentationService = require('./base');
const InitiatePaymentService = require('../payment/initiatePayment');
const BadRequestException = require('../../exception/bad');

module.exports = class CompletePresentationService extends PresentationService
{
    constructor(user, data) {
      super(user, data);

      this.id = data.id;
    }

    async complete() {
      await this.searchPresentation();
      this.ensurePresentationWasFound()
        .ensurePresentationIsAccepted()
        .populatePresentation();

      await this.savePresentation();
      return this;
    }

    ensurePresentationIsAccepted() {
      if (this.presentation.status !== 'accepted') {
        throw new BadRequestException('Cannot close non accepted proposal');
      }

      return this;
    }

    populatePresentation() {
      if (this.presentation.confirm_status === undefined || this.presentation.confirm_status === null) { 
        this.presentation.confirm_status = [];
      }

      if (this.presentation.confirm_status.includes(this.user.role)) {
        throw new BadRequestException(`Already confirmed by ${this.user.role}`);
      }

      this.presentation.confirm_status.push(this.user.role[0]);

      // When both parties confirm, we can complete the presentation
      if (this.presentation.confirm_status.includes('artist') && this.presentation.confirm_status.includes('contractor')) {
        this.presentation.status = 'completed';
        
        // Trigger payment flow
        this.createPayment();
      }

      return this;
    }

    async createPayment() {
      const initiatePaymentSvc = new InitiatePaymentService(this.presentation);
      try {
        await initiatePaymentSvc.initiate();
      } catch (error) {
        // TODO handle payment error
      }

      return this;
    }
}
