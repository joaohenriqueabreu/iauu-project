const _ = require('lodash')
const BadRequestException = require('../../exception/bad')
const ProposalService = require('./base')
const SendMailService = require('../mail/sendMail')
const Proposal = require('../../models/proposal')

module.exports = class SendCounterOfferService extends ProposalService
{
    constructor(user, id) {
      super(user)
      
      this.id = id;
    }

    async send(counterOffer) {
      this.counterOffer = counterOffer;

      await this.searchProposal()
      this.ensureUserIsArtist()
        .ensureProposalWasFound()
        .ensureProposal()
        .ensureCounterOfferIsNotAccepted()
        .populateModel();

      await this.saveProposal()

      this.sendCounterOfferMail()
      this.sendCounterOfferNotification()
      return this
    }

    ensureProposal() {
      if (this.proposal.status !== 'proposal') {
        throw new BadRequestException('Cannot save counter offer for non proposal')
      }

      return this
    }

    ensureCounterOfferIsNotAccepted() {
      if (this.proposal.counter_offer !== undefined && this.proposal.counter_offer.status === 'accepted') {
        throw new BadRequestException('Counter offer already accepted')
      }

      return this
    }

    populateModel() {
      this.proposal.counter_offer = this.counterOffer
      this.proposal.counter_offer.status = 'pending'
      
      // Counter offer price becomes proposal resulting price
      this.proposal.price = this.proposal.current_price;
      return this
    }

    sendCounterOfferMail() {
      console.log('Sending proposal mail...');
      return this.sendMail();
    }

    sendCounterOfferNotification() {
      console.log('Creating proposal notification...');
      return this.sendNotification();
    }
}
