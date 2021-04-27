const _ = require('lodash');
const BadRequestException = require('../../exception/bad');
const ProposalService     = require('./base');
const { CounterOffer }    = require('../../models/schemas');

module.exports = class SendCounterOfferService extends ProposalService
{
    constructor(user, id) {
      super(user);
      
      this.id = id;
    }

    async send(counterOffer) {
      this.counterOffer = counterOffer;

      await this.searchProposal();
      this.ensureUserIsArtist()
        .ensureProposalWasFound()
        .ensureProposal()
        .ensureUserIsPartyToProposal()
        .ensureCounterOfferIsNotAccepted()
        .populateModel();

      await this.saveProposal();

      this.sendMail();
      this.sendNotification();
      return this;
    }

    ensureProposal() {
      if (this.proposal.status !== 'proposal') {
        throw new BadRequestException('Cannot save counter offer for non proposal');
      }

      return this;
    }

    ensureCounterOfferIsNotAccepted() {
      if (this.proposal.counter_offer !== undefined && this.proposal.counter_offer.status === 'accepted') {
        throw new BadRequestException('Counter offer already accepted');
      }

      return this;
    }

    populateModel() {
      console.log(this.counterOffer);
      this.proposal.counter_offer         = new CounterOffer(this.counterOffer);
      this.proposal.counter_offer.status  = 'pending';

      // Convert duration
      // this.proposal.counter_offer.duration = this.getDurationInMinutes();
      
      // Counter offer price becomes proposal resulting price
      this.proposal.price = this.proposal.current_price;
      return this;
    }

    getDurationInMinutes() {
      const parts = this.counterOffer.duration.split(':');

      // Not a valid HH:mm format
      if (parts.length !== 2) { return this.counterOffer.duration; }

      return (parts[0] * 60) + parts[1];
    }

    sendMail() {
      console.log('Sending proposal mail...');
      return super.sendMail();
    }

    sendNotification() {
      console.log('Creating proposal notification...');
      return super.sendNotification();
    }
}
