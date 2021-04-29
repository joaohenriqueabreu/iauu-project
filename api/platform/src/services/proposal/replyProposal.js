const _               = require('lodash');
const ProposalService = require('./base');
const { EVENTS }      = require('lib/events');

module.exports = class ReplyProposalService extends ProposalService
{
    constructor(user, id) {
      super(user, id)
    }

    async reply() {
      await this.searchProposal();
      this.ensureProposalWasFound()
        .ensureIsPartyToProposal()
        .populateProposal();
      await this.saveProposal();

      this.emitEvent();
      return this
    }

    async emitEvent() {
      await this.searchProposal();
      super.emitEvent(EVENTS.PROPOSAL_ACCEPTED_EVENT, this.proposal);
      return this;
    }

    ensureIsPartyToProposal() {
      if (this.user.role_id !== this.proposal.artist_id && 
        this.user.role_id !== this.proposal.contractor_id) {
        throw new UnauthorizedException('User is not party to proposal')
      }

      return this
    }
}
