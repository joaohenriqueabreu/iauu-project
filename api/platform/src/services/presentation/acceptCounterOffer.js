const ReplyCounterOfferService = require('./replyCounterOffer')

module.exports = class AcceptCounterOfferService extends ReplyCounterOfferService
{
    populateModel() {
      this.presentation.proposal.counter_offer.status = 'accepted'
      return this
    }
}
