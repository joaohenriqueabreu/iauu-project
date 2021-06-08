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
      })
        .sort('timeslot.start_dt')
        .limit(10)
        .skip(page);

      return this;
    }

    getPresentations() {
      return this.presentations;
    }
}
