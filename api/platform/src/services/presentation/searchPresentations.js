const _ = require('lodash')
const BaseService = require('../base')
const Presentation = require('../../models/presentation')
const { InterfaceNotImplementedException, Exception } = require('lib/exception')

module.exports = class SearchPresentationsService extends BaseService
{
    constructor() {
      super();

      this.presentations = [];
    }

    async search(id) {
      this.presentations = await Presentation.find({ $or: [{ artist_id: id }, { contractor_id: id }] });
      return this;
    }

    getPresentations() {
      return this.presentations;
    }
}
