const _ = require('lodash');
const BaseService = require('../base');
const Proposal = require('../../models/proposal');
const { UnauthorizedException } = require('lib/exception');

module.exports = class ProposalService extends BaseService
{
    constructor(user) {
      super(user);

      this.proposal = {};
    }

    async searchProposal() {
      this.proposal = await Proposal.findById(this.id)
        .populate({ path: 'contractor', populate: { path: 'user' }})
        .populate({ path: 'artist',  populate: { path: 'user' }});

      return this
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

    async saveProposal() {
      await this.proposal.save();
      return this;
    }

    getProposal() {
      return this.proposal;
    }
}
