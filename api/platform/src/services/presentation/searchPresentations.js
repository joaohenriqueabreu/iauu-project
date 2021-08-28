const config                = require('@iauu/env');
const { _, moment }         = require('@iauu/utils');
const BaseService           = require('../base');
const { Presentation }      = require('../../models');
const { PresentationData }  = require('../../config/data');

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
      if (queryParams.text != null) {
        queryConditions = { ...queryConditions, ...{ $text: { $search: queryParams.text }}};
      }

      if (queryParams.status != null) {
        this.ensureQueryStatusIsValid(queryParams.status);
        queryConditions = { ...queryConditions, ...{ status: { $in: queryParams.status }}}
      }

      if (queryParams.from != null) {
        queryConditions = { 
          ...queryConditions, 
          ...{ 'timeslot.start_dt': { $gte: moment(queryParams.from, config.format.dbDate).format(config.format.dbDate) }}
        }
      }

      if (queryParams.to != null) {
        queryConditions = { 
          ...queryConditions, 
          ...{ 'timeslot.end_dt': { $lte: moment(queryParams.to, config.format.dbDate).add(1, 'days').format(config.format.dbDate) }}
        }
      }

      console.log(queryConditions);
      return queryConditions;
    }

    ensureQueryStatusIsValid(status) {
      if (! PresentationData.PRESENTATION_STATUS.includes(status)) {
        throw new BadRequestException('Invalid status provided');
      }

      return this;
    }

    getPresentations() {
      return this.presentations;
    }
}
