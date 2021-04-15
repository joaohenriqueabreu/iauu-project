const BaseService = require('../base');
const { Billings, Billing } = require('../../models');

module.exports = class SearchBillingsService extends BaseService {
  constructor() {
    super();

    this.billings = [];
  }

  async search() {
    await this.searchBillings();

    return this;
  }

  async searchBillings() {
    this.billings = await Billing.find({});
    return this;
  }

  getBillings() {
     return this.billings;
  }
}