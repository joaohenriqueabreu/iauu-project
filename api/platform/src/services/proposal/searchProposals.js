const { _, moment } = require('iauu/utils');
const config        = require('iauu/env');
const BaseService   = require('../base');
const { Proposal }  = require('../../models');
const { ProposalData } = require('../../config/data');
const { BadRequestException } = require('iauu/exception');

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
        this.ensureQueryStatusIsValid(queryParams.status);
        queryConditions = { ...queryConditions, ...{ status: { $in: [queryParams.status] }}}
      }

      if (queryParams.from != null) {
        queryConditions = { 
          ...queryConditions, 
          ...{ 'timeslots.start_dt': { $gte: moment(queryParams.from, config.format.dbDate).format(config.format.dbDate) }}
        }
      }

      if (queryParams.toRefs != null) {
        queryConditions = { 
          ...queryConditions, 
          ...{ 'timeslots.start_dt': { $lte: moment(queryParams.to, config.format.dbDate).add(1, 'days').format(config.format.dbDate) }}
        }
      }
      
      console.log(queryConditions)
      return queryConditions;
    }

    ensureQueryStatusIsValid(status) {
      if (! ProposalData.PROPOSAL_STATUS.includes(status)) {
        throw new BadRequestException('Invalid status provided');
      }

      return this;
    }

    getProposals() {
      return this.proposals;
    }
}
