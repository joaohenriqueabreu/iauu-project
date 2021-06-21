const { EVENTS }          = require('iauu/events');
const PresentationService = require('./base');
const BadRequestException = require('../../exception/bad');

module.exports = class CompletePresentationService extends PresentationService
{
    constructor(user) {
      super(user);
    }

    async complete(id) {
      this.id = id;

      this.ensureUserRoleIsValid();
      await this.searchPresentation();
      this.ensurePresentationWasFound()
        .ensurePresentationIsAccepted()
        .populatePresentation();

      await this.savePresentation();
      this.sendPresentationCompleteEvent();
      return this;
    }

    ensurePresentationIsAccepted() {
      if (this.presentation.status !== 'accepted') {
        throw new BadRequestException('Cannot close non accepted proposal');
      }

      return this;
    }

    ensureUserRoleIsValid() {
      if (! Array.isArray(this.user.role)) {
        throw new BadRequestException('Invalid user role provided');
      }

      return this;
    }

    populatePresentation() {
      if (this.presentation.confirm_status === undefined || this.presentation.confirm_status === null) { 
        this.presentation.confirm_status = [];
      }

      if (this.presentation.confirm_status.includes(this.user.role[0])) {
        throw new BadRequestException(`Already confirmed by ${this.user.role[0]}`);
      }

      this.presentation.confirm_status.push(this.user.role[0]);

      // When both parties confirm, we can complete the presentation
      if (this.presentation.confirm_status.includes('artist') && this.presentation.confirm_status.includes('contractor')) {
        this.presentation.status = 'completed';
      }

      return this;
    }

    async sendPresentationCompleteEvent() {
      super.emitEvent(EVENTS.PRESENTATION_COMPLETE, this.presentation);
      return this;
    }
}
