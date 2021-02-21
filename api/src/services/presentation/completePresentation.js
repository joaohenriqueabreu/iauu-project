const _ = require('lodash');
const PresentationService = require('./base');
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
      this.sendMarkedAsCompleteMail();
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

      this.presentation.confirm_status.push(this.user.role);

      // When both parties confirm, we can complete the presentation
      if (this.presentation.confirm_status.includes('artist') && this.presentation.confirm_status.includes('contractor')) {
        this.presentation.status = 'completed';
      }

      return this;
    }

    // TODO implement send mail fns
    // sendArtistMakedCompleteMail() {
    //   return this;
    // }

    // sendContractorMarkedCompleteMail() {
    //   return this;
    // }

    sendMarkedAsCompleteMail() {
      return this;
    }
}
