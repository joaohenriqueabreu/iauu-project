const _             = require('lodash');
const BaseService   = require('../base');
const Presentation  = require('../../models/presentation');

module.exports = class SearchPresentationsService extends BaseService
{
    constructor() {
      super();

      this.presentations = [];
    }

    async search(id, query) {
      let page = query != null && query.page != null ? query.page * 10 : 0;

      this.presentations = await Presentation.find({ 
        $or: [{ artist_id: id }, { contractor_id: id }],
        ...this.additionalQueryConditions(query)
      })
        .sort('timeslot.start_dt')
        .limit(10)
        .skip(page);

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

    getPresentations() {
      return this.presentations;
    }
}
