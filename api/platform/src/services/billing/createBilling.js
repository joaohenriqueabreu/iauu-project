const { EventConsumerService }    = require('lib/events');
const { DataRequestService }      = require('lib/services');
const { Billing }                 = require('../../models');
const { BadRequestException }     = require('../../exception');
const SearchArtistAccountService  = require('./searchArtistAccount');

module.exports = class CreateBillingService extends EventConsumerService
{
    constructor() {
      super();

      this.billing                = {};
      this.searchArtistAccountSvc = new SearchArtistAccountService();
    }

    async save(presentationData) {
      console.log('Requesting additional data for service...');
      const [artist, contractor] = await Promise.all([
        DataRequestService.getArtist(presentationData.artist_id),
        DataRequestService.getContractor(presentationData.contractor_id),
      ]);
      
      this.billingData = {
        ...{presentation: presentationData},
        ...{artist: artist},
        ...{contractor: contractor},
      };

      await this.searchArtist();
      this.populateBilling();
      await this.saveBilling();
      return this;
    }

    async searchBilling() {
      this.billing = await Billing.findById(this.id);
      return this;
    }

    ensureBillingWasFound() {
      if (Billing.notFound(this.billing)) {
        throw new BadRequestException('Invalid billing provided');
      }

      return this;
    }

    async searchArtist() {
      await this.searchArtistAccountSvc.search(this.billingData.artist.id);
      this.artist = this.searchArtistAccountSvc.getArtist();
      
      // TODO when migrating to micro-service Fetch or create a (billing) artist model if one doesn't exist
      // this.artist = await Artist.findById(this.billingData.artist.id);

      // if (! this.artist instanceof Artist) {
      //   throw new BadRequestException('Invlid Artist provided');
      // }

      // if (!this.artist instanceof Artist) { 
      //   await (new CreateArtistService()).save();
      // }

      return this;
    }

    populateBilling() {
      this.billing = new Billing(this.billingData);

      this.billing.total_amount     = this.billingData.presentation.price;
      this.billing.fee              = this.billingData.presentation.fee;

      this.billing.artist           = this.artist.id;
      this.billing.presentation_id  = this.billingData.presentation.id;
      this.billing.contractor_id    = this.billingData.contractor.id;

      // this.billing.presentation = {
      //   id: this.billingData.presentation.id,
      //   title: this.billingData.presentation.proposal.title,
      //   presentation_dt: this.billingData.presentation.timeslot.start_dt
      // }

      // this.billing.contractor = { id: this.billingData.contractor.id }

      return this;
    }

    async saveBilling() {
      await this.billing.save();
      return this;
    }

    getBilling() {
      return this.billing;
    }
}