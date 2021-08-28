const { _, moment }         = require('@iauu/utils');
const ReplyProposalService  = require('./replyProposal');
const BadRequestException   = require('../../exception/bad');
const { EVENTS }            = require('@iauu/events');

module.exports = class AcceptProposalService extends ReplyProposalService
{
  ensureCanReplyProposal() {
    // ensureProposalHasTimeslot
    if (this.proposal.timeslot === undefined || this.proposal.timeslot === null) {
      throw new BadRequestException('Please select a timeslot before accepting a proposal');
    }

    // ensure proposal is not past
    if (moment(this.proposal.timeslot.start_dt).isBefore(moment())) {
      throw new BadRequestException('Cannot accept past proposal');
    }

    return this;
  }

  populateProposal() {
    this.proposal.status = 'accepted';

    // Proposal price and duration copy from counter offer or product
    if (this.proposal.counter_offer !== undefined && this.proposal.counter_offer.status === 'accepted') {
      console.log('Has counter offer...');
      this.proposal.price = this.proposal.counter_offer.price;
      this.proposal.duration = this.proposal.counter_offer.duration;
      return this;
    }

    // If there is a product, copy value from the product, otherwise look for a counter offer
    if (this.proposal.product !== undefined && !this.proposal.product.custom) {
      console.log('Has selected product...');
      this.proposal.price = this.proposal.product.price;
      this.proposal.duration = this.proposal.product.duration;
      return this;
    }

    throw new BadRequestException('Cannot accept proposal without an agreed price and duration');
  }

  afterReply() {
    super.emitEvent(EVENTS.PROPOSAL_ACCEPTED_EVENT, this.proposal);
    return this;
  }
}
