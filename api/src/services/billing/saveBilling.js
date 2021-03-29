
const BaseService = require('../base');
const { Billing } = require('../../models');
const RequestEndpointService = require('../request');

module.exports = class SaveArtistAccountService extends BaseService
{
    constructor() {
      super();

      this.billing = {};
      this.requestEndpointSvc = new RequestEndpointService();
    }

    async save(billingData) {
      // By dataMiddleware assume that we have all this information
      this.billingData = billingData;

      this.populateBilling();
      await this.saveBilling();
      return this;
    }

    populateBilling() {
      this.billing = new Billing(this.presentationData);
      this.billing.presentation = this.billingData.presentation;
      this.billing.artist = this.billingData.artist;

      return this;
    }

    async ensurePartiesExists() {
      await this.requestEndpointSvc.get(``)
    }
}