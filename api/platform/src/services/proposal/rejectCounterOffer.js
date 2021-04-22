const ReplyCounterOfferService = require('./replyCounterOffer')

module.exports = class RejectCounterOfferService extends ReplyCounterOfferService
{
    populateModel() {
      this.proposal.counter_offer.status  = 'rejected';
      this.proposal.rejected_counter_offers.push(this.proposal.counter_offer);
      this.proposal.counter_offer         = undefined;
      return this;
    }
}
