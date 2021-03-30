const ReplyCounterOfferService = require('./replyCounterOffer')

module.exports = class RejectCounterOfferService extends ReplyCounterOfferService
{
    populateModel() {
      this.presentation.proposal.counter_offer.status = 'rejected'
      return this
    }
}
