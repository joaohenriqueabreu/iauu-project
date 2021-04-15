const { BadRequestException } = require('../../exception');
const BaseService = require('../base');
const { Billing } = require('../../models');

module.exports = class SearchPresentationBillingService extends BaseService {

  constructor() {
    super();

    this.billing = {};
  }

  async search(id) {
    this.presentationId = id;
    await this.searchBillingFromPresentation();
    this.ensureBillingWasFound();
    return this;
  }

  async searchBillingFromPresentation() {
    this.billing = await Billing.findOne({ presentation_id: this.presentationId }).populate('payments.instalment', 'num');
    return this;
  }

  ensureBillingWasFound() {
    if (! this.billing instanceof Billing) {
      throw new BadRequestException('Could not find billing for presentation');
    }

    return this;
  }

  getBilling() {
    return this.billing;
  }
}