const _                                   = require('lodash');
const RequestEndpointService              = require('iauu/services/request');
const GatewayCreateAccountServiceBuilder  = require('../builders/gatewayCreateAccountServiceBuilder');
const VendorGatewayCreateAccountInterface = require('../interfaces/vendorGatewayCreateAccount');
const BaseService                         = require('../base');
const { BadRequestException }             = require('../../exception');
const { ArtistAccount }                   = require('../../models');
const { DataRequestService } = require('iauu/services');

module.exports = class SaveArtistAccountService extends BaseService
{
  /** @param { VendorGatewayCreateAccountInterface } createGatewayAccountSvc */
    constructor(user) {
      super(user);

      this.id = user.role_id;
    }

    async save(bankAccountData) {
      this.bankAccount = bankAccountData;
      this.ensureBankAccountIsValid();

      await this.searchArtist();
      this.ensureArtistCanSaveAccount();

      this.ensureArtistCanConnectBankAccount()
        .parseBankAccountData()
        .assignArtistBankAccount();

      await this.saveArtist();
      this.initCreateAccountService();
      await this.createArtistGatewayAccount();
      this.assignArtistGatewayAccount();
      await this.saveArtist();
      this.sendConnectedAccountMail();
      return this;
    }

    async searchArtist() {
      console.log('Searching for artist...');
      this.artist = await ArtistAccount.findOne({ source_id: this.id });

      // Create artist if not found
      if (ArtistAccount.notFound(this.artist) || !this.artist instanceof ArtistAccount) {
        let artistData  = DataRequestService.getArtist(this.id);
        this.artist     = new ArtistAccount({ source_id: this.id,  ...artistData});
      }

      return this;
    }

    ensureArtistCanSaveAccount() {
      if (this.artist.email === undefined) {
        throw new BadRequestException('Artist missing required information');
      }

      return this;
    }

    ensureBankAccountIsValid() {
      return this;
    }

    parseBankAccountData() {
      // Must provide bankAccount number digit
      const bankAccountNumberParts = this.bankAccount.number.split('-');
      if (bankAccountNumberParts.length !== 2) {
        throw new BadRequestException('Unformatted bank account number provided');
      }

      this.bankAccount.number = bankAccountNumberParts[0];
      this.bankAccount.number_digit = bankAccountNumberParts[1];
      return this;
    }

    assignArtistBankAccount() {
      if (this.artist.account === undefined) { this.artist.account = {}; }
      this.artist.account.bank = this.bankAccount;
      return this;
    }

    async saveArtist() {
      await this.artist.save();
      console.log('Artist saved...');

      return this;
    }

    ensureArtistCanConnectBankAccount() {
      return this;
    }

    // Cannot init from constructor as it requires artist info
    initCreateAccountService() {
      this.createGatewayAccountSvc = (new GatewayCreateAccountServiceBuilder(this.artist)).getService();
      return this;
    }

    async createArtistGatewayAccount() {
      this.gatewayAccount = await this.createGatewayAccountSvc.create(this.bankAccount);
      return this;
    }

    assignArtistGatewayAccount() {
      console.log(this.gateway);
      this.artist.account.gateway = this.gatewayAccount;
      return this;
    }

    sendConnectedAccountMail() {
      return this;
    }

    getAccount() {
      return this.artist.account;
    }
}