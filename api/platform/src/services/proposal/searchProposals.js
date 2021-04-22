const _ = require('lodash')
const BadRequestException = require('../../exception/bad')
const BaseService = require('../base')
const Proposal = require('../../models/proposal')

module.exports = class SearchProposalsService extends BaseService
{
    constructor() {
      super();

      this.proposals  = [];
    }

    async search(id, query) {
      // TODO build query support
      this.proposals = await Proposal.find({ $or: [{ artist_id: id }, { contractor_id: id }], status: { $in: ['proposal'] }});
      return this;
    }

    getProposals() {
      return this.proposals;
    }
}
