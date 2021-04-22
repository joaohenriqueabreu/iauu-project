const _ = require('lodash')
const BadRequestException = require('../../exception/bad')
const BaseService = require('../base')
const { Proposal } = require('../../models')

module.exports = class SearchProposalService extends BaseService
{
    constructor(user) {
      super(user)

      this.proposal = {};
    }

    async search(id) {
      this.id = id;
      await this.searchProposal();
      this.ensureProposalWasFound();

      return this;
    }

    async searchProposal() {
      this.proposal = await Proposal.findById(this.id);
      return this;
    }

    ensureProposalWasFound() {
      if (Proposal.notFound(this.proposal)) {
        throw new BadRequestException('Invalid proposal provided');
      }

      return this;
    }

    getProposal() {
      return this.proposal;
    }
}
