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
        ...this.additionalQueryConditions(query)
      }).sort('-created_at');

      return this;
    }

    additionalQueryConditions(queryParams) {
      if (queryParams == null) { return {}; }

      let queryConditions = {};
      if (queryParams.status != null) {
        queryConditions = { ...queryConditions, ...{ status: { $in: queryParams.status }}}
      }

      // TODO build query support
      return queryConditions;
    }

    getProposals() {
      return this.proposals;
    }
}
