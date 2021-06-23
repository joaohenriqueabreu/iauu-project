const { EVENTS, EventConsumerService }  = require('iauu/events');
const { DataRequestService }            = require('iauu/services');
const { Billing }                       = require('../../models');
const SearchArtistAccountService        = require('./searchArtistAccount');
const { 
  BadRequestException, 
  ManualPaymentRequiredException,
} = require('iauu/exception');

module.exports = class CreateBillingService extends EventConsumerService
{
    constructor() {
      super();

      this.billing                = {};
      this.searchArtistAccountSvc = new SearchArtistAccountService();
    }

    async save(presentation) {
      await this.buildBillingData(presentation);
      await this.searchArtistAccount();
      this.populateBilling();
      await this.saveBilling();
      return this;
    }

    async buildBillingData(presentation) {
      console.log('Requesting additional data for service...');

      // Eventhough we only their ids fetch artist and contractor so we make sure they are valid
      // TODO investigate if this is really necessary
      const [artist, contractor] = await Promise.all([
        DataRequestService.getArtist(presentation.artist_id),
        DataRequestService.getContractor(presentation.contractor_id),
      ]);
      
      this.billingData = {
        ...{ presentation: presentation },
        ...{ artist:       artist },
        ...{ contractor:   contractor },
      };

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

    async searchArtistAccount() {
      try {
        await this.searchArtistAccountSvc.search(this.billingData.artist.id);
      } catch (error) {
        // Rollback presentation creation
        this.emitEvent(EVENTS.BANK_ACCOUNT_NOT_LINKED_EVENT, this.billingData.presentation.id);
        throw new ManualPaymentRequiredException('Artist has no bank account');
      }
      
      this.artistAccount = this.searchArtistAccountSvc.getArtistAccount();
      return this;
    }

    populateBilling() {
      this.billing = new Billing(this.billingData);

      this.billing.total_amount     = this.billingData.presentation.price;
      this.billing.fee              = this.billingData.presentation.fee;

      this.billing.artist_account   = this.artistAccount.id;
      this.billing.presentation_id  = this.billingData.presentation.id;
      this.billing.contractor_id    = this.billingData.contractor.id;
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