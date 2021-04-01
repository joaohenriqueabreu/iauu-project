const _ = require('lodash');
const moment = require('moment');
const ReplyProposalService = require('./replyProposal');
const BadRequestException = require('../../exception/bad');

module.exports = class AcceptProposalService extends ReplyProposalService
{
  ensureCanReplyProposal() {
    // ensurePresentationHasTimeslot
    if (this.presentation.timeslot === undefined || this.presentation.timeslot === null) {
      throw new BadRequestException('Please select a timeslot before accepting a proposal');
    }

    // ensure presentation is not past
    if (moment(this.presentation.timeslot.start_dt).isBefore(moment())) {
      throw new BadRequestException('Cannot accept past presentation');
    }

    return this;
  }

  populatePresentation() {
    this.presentation.status = 'accepted';

    // Presentation price and duration copy from counter offer or product
    if (this.presentation.proposal.counter_offer !== undefined && this.presentation.proposal.counter_offer.status === 'accepted') {
      console.log('Has counter offer...');
      this.presentation.price = this.presentation.proposal.counter_offer.price;
      this.presentation.duration = this.presentation.proposal.counter_offer.duration;
      return this;
    }

    // If there is a product, copy value from the product, otherwise look for a counter offer
    if (this.presentation.proposal.product !== undefined && !this.presentation.proposal.product.custom) {
      console.log('Has selected product...');
      this.presentation.price = this.presentation.proposal.product.price;
      this.presentation.duration = this.presentation.proposal.product.duration;
      return this;
    }

    throw new BadRequestException('Cannot accept presentation without an agreed price and duration');
  }
}
