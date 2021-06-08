const _             = require('lodash');
const BaseService   = require('../base');
const { Proposal }  = require('../../models');

module.exports = class SearchProposalsService extends BaseService
{
    constructor() {
      super();

      this.proposals  = [];
    }

    async search(id, query) {      
      this.proposals = await Proposal.find({ 
        $or: [{ artist_id: id }, { contractor_id: id }], 
        status: { $in: ['proposal'] },
        ...this.additionalQueryConditions(query)
      }).sort('-created_at');

      return this;
    }

    additionalQueryConditions(query) {
      if (query == null) { return {}; }

      // TODO build query support
      return {};
    }

    getProposals() {
      return this.proposals;
    }
}
