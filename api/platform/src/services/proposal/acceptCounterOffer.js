const ReplyCounterOfferService = require('./replyCounterOffer')

module.exports = class AcceptCounterOfferService extends ReplyCounterOfferService
{
    populateModel() {
      this.proposal.counter_offer.status = 'accepted';
      this.proposal.notes     += this.proposal.counter_offer.notes;
      this.proposal.price     = this.proposal.counter_offer.price;
      this.proposal.duration  = this.proposal.counter_offer.duration;
      return this
    }
}
