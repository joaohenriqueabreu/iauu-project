const _ = require('lodash');
const ProposalService     = require('./base');
const { Proposal }        = require('../../models');
const Location            = require('../../models/helpers/location');

module.exports = class SendProposalService extends ProposalService
{
    constructor(user) {
      super(user);

      // TODO we should not care if this user is db or jwt-auth (and having to use role_id couples that implementation)
      //  we should change this around
      this.contractorId = this.user.role_id;
    }

    async send(proposalData, artistId) {
      this.proposalData = proposalData;
      this.artistId     = artistId;
      this.ensureUserIsContractor()
        .ensureTimeslotsDontOverlapWithExistingPresentation()
        .createProposal()
        .populateModel()
        .calculateProposalPrice();

      await this.saveProposal();

      this.sendMail();
      this.sendNotification();
      return this;
    }

    ensureTimeslotsDontOverlapWithExistingPresentation() {
      // TODO implement logic
      return this;
    }

    createProposal() {
      this.proposal         = new Proposal(this.proposalData);
      this.proposal.status  = 'proposal';
      return this;
    }

    populateModel() {
      this.proposal.artist_id     = this.artistId;
      this.proposal.contractor_id = this.contractorId;
      this.proposal.address       = new Location(this.proposalData.address);
      return this;
    }

    calculateProposalPrice() {
      // Calculate proposal price (either 0 at this point for custom product or product's price)
      this.proposal.price = this.proposalData.current_price;
      return this;
    }

    sendMail() {
      console.log('Sending proposal mail...');
      return super.sendMail(
        this.proposal.contractor, 
        this.proposal.artist, 
        'Você recebeu uma nova proposta', 
        'proposal', 
        this.proposal
      );
    }

    sendNotification() {
      console.log('Creating proposal notification...');
      return super.sendNotification(
        this.proposal.contractor, 
        this.proposal.artist, 
        'Você recebeu uma nova proposta', 
        'proposal', 
        this.proposal
      );
    }
}
