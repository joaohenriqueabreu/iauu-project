const moment = require('moment');
const BaseService = require('../base');
const { Billing } = require('../../models');
const RequestEndpointService = require('lib/services/request');

module.exports = class SaveArtistAccountService extends BaseService
{
    constructor() {
      super();

      this.billing = {};
      this.requestEndpointSvc = new RequestEndpointService();
    }

    async save(billingData) {
      // By dataMiddleware assume that we have all required information (presentation, artist, contractor)
      this.billingData = billingData;

      await this.searchArtist();
      this.populateBilling();
      await this.saveBilling();
      return this;
    }

    async searchArtist() {
      this.artist = await Artist.find({ _id: this.billingData.artist.id });
      return this;
    }

    populateBilling() {
      this.billing = new Billing(this.billingData);

      this.billing.total_amount = this.billingData.presentation.price;
      this.billing.fee = this.billingData.presentation.fee;

      this.billing.presentation = {
        id: this.billingData.presentation.id,
        title: this.billingData.presentation.proposal.title,
        presentation_dt: this.billingData.presentation.timeslot.start_dt
      }

      this.billing.artist = this.artist.id;
      this.billing.contractor = this.billingData.contractor.id

      return this;
    }

    async saveBilling() {
      await this.billing.save();
      return this;
    }
}