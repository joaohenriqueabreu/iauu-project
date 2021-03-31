const { BadRequestException } = require('../../exception');
const PresentationService = require('./base');

module.exports = class ManagePresentationChecklistService extends PresentationService
{
    constructor(id) {
      super();

      this.id = id;
    }

    async update({ checklist }) {
      if (checklist == null) { 
        throw new BadRequestException('Invalid checklist provided');
       }

      await this.searchPresentation();
      this.ensurePresentationWasFound();

      this.presentation.checklist = checklist;
      await this.savePresentation();
      return this;
    }
}
