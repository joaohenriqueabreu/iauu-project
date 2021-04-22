const _ = require('lodash')
const ReplyProposalService = require('./replyProposal')

module.exports = class RejectProposalService extends ReplyProposalService
{
    populateProposal() {
      this.proposal.status = 'rejected'
      return this
    }
}