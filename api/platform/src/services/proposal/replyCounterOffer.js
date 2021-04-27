const _                   = require('lodash');
const BadRequestException = require('../../exception/bad');
const ProposalService     = require('./base');
const Proposal            = require('../../models/proposal');

module.exports = class ReplyCounterOfferService extends ProposalService
{
    constructor(user) {
      super(user);
    }

    async reply(id) {
      this.id = id;

      await this.searchProposal();
      this.ensureProposalWasFound()
        .ensureProposal()
        .ensureUserIsPartyToProposal()
        .ensureCounterOfferExists()
        .ensureCounterOfferIsNotAccepted()
        .populateModel();

      await this.saveProposal();

      this.sendMail();
      this.sendNotification();
      return this
    }

    ensureProposal() {
      if (this.proposal.status !== 'proposal') {
        throw new BadRequestException('Cannot save counter offer for non proposal');
      }

      return this
    }

    ensureCounterOfferExists() {
      if (this.proposal.counter_offer === undefined || this.proposal.counter_offer === null) {
        throw new BadRequestException('Counter offer does not exists');
      }

      return this;
    }

    ensureCounterOfferIsNotAccepted() {
      if (this.proposal.counter_offer !== undefined && this.proposal.counter_offer.status === 'accepted') {
        throw new BadRequestException('Counter offer already accepted');
      }

      return this
    }

    populateModel() {
      return this;
    }

    sendMail() {
      console.log('Sending counter offer mail...');
      return super.sendMail();
    }

    sendNotification() {
      console.log('Creating counter offer notification...');
      return super.sendNotification();
    }
}
