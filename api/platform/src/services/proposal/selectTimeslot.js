const _ = require('lodash')
const ProposalService = require('./base')
const BadRequestException = require('../../exception/bad')

module.exports = class SelectTimeslotService extends ProposalService
{
    constructor(proposalId) {
      super()

      this.id = proposalId;
    }

    async select(timeslot) {
      this.timeslot = timeslot;

      await this.searchProposal()
      await this.ensureProposalWasFound()
      await this.populateTimeslot()
      await this.saveProposal()
      return this
    }

    populateTimeslot() {
      this.proposal.selected_timeslot = this.timeslot
      return this
    }
}
