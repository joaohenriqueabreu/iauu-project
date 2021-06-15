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

      this.id             = user.role_id;
      this.artistAccount  = {};
      this.bankAccount    = {};
      this.artist         = {};
    }

    async save(bankAccountData) {
      this.bankAccount = bankAccountData;
      this.ensureBankAccountIsValid();

      await this.getArtist();
      this.ensureArtistWasFound();
      await this.searchArtistAccount();
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

    async getArtist() {
      console.log('Requesting artist...');
      this.artist = await DataRequestService.getArtist(this.id);
      return this;
    }

    ensureArtistWasFound() {
      if (this.artist == null) {
        throw new BadRequestException('Artist not found');
      }
    }

    async searchArtistAccount() {
      console.log('Searching artist account...');
      this.artistAccount = await ArtistAccount.findOne({ source_id: this.id });

      // Create artist account if not found
      if (ArtistAccount.notFound(this.artistAccount) || !this.artistAccount instanceof ArtistAccount) {        
        this.artistAccount = new ArtistAccount({ source_id: this.id,  ...this.artist });
      }

      return this;
    }

    ensureArtistCanSaveAccount() {
      if (this.artist.email == null) {
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

      this.bankAccount.number       = bankAccountNumberParts[0];
      this.bankAccount.number_digit = bankAccountNumberParts[1];
      this.artistAccount.document   = this.bankAccount.document;
      return this;
    }

    assignArtistBankAccount() {
      if (this.artistAccount.account === undefined) { this.artistAccount.account = {}; }
      this.artistAccount.account.bank = this.bankAccount;
      return this;
    }

    async saveArtist() {
      await this.artistAccount.save();
      console.log('Artist saved...');

      return this;
    }

    ensureArtistCanConnectBankAccount() {
      return this;
    }

    // Cannot init from constructor as it requires artist info
    initCreateAccountService() {
      this.createGatewayAccountSvc = (new GatewayCreateAccountServiceBuilder(this.artistAccount)).getService();
      return this;
    }

    async createArtistGatewayAccount() {
      this.gatewayAccount = await this.createGatewayAccountSvc.create(this.bankAccount);
      return this;
    }

    assignArtistGatewayAccount() {
      console.log(this.gateway);
      this.artistAccount.account.gateway = this.gatewayAccount;
      return this;
    }

    sendConnectedAccountMail() {
      return this;
    }

    getAccount() {
      return this.artistAccount.account;
    }
}