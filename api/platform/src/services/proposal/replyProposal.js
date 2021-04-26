const _ = require('lodash')
const ProposalService = require('./base')

module.exports = class ReplyProposalService extends ProposalService
{
    constructor(user, data) {
      super(user, data)

      this.id = data.id
    }

    async reply() {
      await this.searchProposal()
      this.ensureProposalWasFound()
        .ensureIsPartyToProposal()
        .populateProposal();
      await this.saveProposal()
      return this
    }

    ensureIsPartyToProposal() {
      if (this.user.role_id !== this.proposal.artist_id && 
        this.user.role_id !== this.proposal.contractor_id) {
        throw new UnauthorizedException('User is not party to proposal')
      }

      return this
    }
}
