const _ = require('lodash');
const BaseService = require('../base');
const Proposal = require('../../models/proposal');
const { UnauthorizedException } = require('iauu/exception');

module.exports = class ProposalService extends BaseService
{
    constructor(user, id) {
      super(user);

      this.id       = id;
      this.proposal = {};
    }

    async update(data) {
      this.proposalData = data;

      await this.searchProposal();
      this.ensureProposalWasFound()
        .ensureUserIsPartyToProposal()
        .populateProposal();

      await this.saveProposal();
      return this;
    }

    async searchProposal() {
      this.proposal = await Proposal.findById(this.id);
      return this;
    }

    ensureProposalWasFound() {
      if (Proposal.notFound(this.proposal) || ! this.proposal instanceof Proposal) {
        throw new Error('Proposal not found...');
      }
  
      console.log('Proposal found...');
      return this;
    }

    ensureUserIsPartyToProposal() {
      if (this.user.role_id !== this.proposal.artist_id && this.user.role_id !== this.proposal.contractor_id) {
        throw new UnauthorizedException('This user cannot interact with proposal');
      }

      return this;
    }

    populateProposal() {
      // Delete id from data so it does not attempt to change proposal's
      delete(this.proposalData.id);

      // TODO maybe move this to BaseModel (some kind of edit function)
      for (const prop in this.proposalData) {
        this.proposal[prop] = this.proposalData[prop];
      }

      return this;
    }

    async saveProposal() {
      await this.proposal.save();
      return this;
    }

    getProposal() {
      return this.proposal;
    }
}
