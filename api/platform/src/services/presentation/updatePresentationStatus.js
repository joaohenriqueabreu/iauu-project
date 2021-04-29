const { EventConsumerService }  = require('lib/events');
const { BadRequestException }   = require('lib/exception');
const { Presentation }          = require('../../models');

module.exports = class UpdatePresentationStatusService extends EventConsumerService {
  constructor() {
    super();

    this.presentation = {};
  }

  async update(billingData) {
    this.billingData = billingData;

    // this.presentationData = { status: status};

    await this.searchPresentation();
    this.ensurePresentationWasFound()
      .populatePresentation();

    await this.savePresentation();
  }

  async searchPresentation() {
    this.presentation = await Presentation.findById(this.billingData.presentation_id);
    return this;
  }

  ensurePresentationWasFound() {
    if (Presentation.notFound(this.presentation)) {
      throw new BadRequestException('Invalid presentation provided');
    }

    return this;
  }
}