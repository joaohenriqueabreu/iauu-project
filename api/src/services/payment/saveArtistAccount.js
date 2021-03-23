const _ = require('lodash');
const GatewayCreateAccountServiceBuilder = require('../builders/gatewayCreateAccountServiceBuilder');
const SaveArtistProfileService = require('../artist/saveProfile');
const { BadRequestException, Exception } = require('../../exception');
const VendorGatewayCreateAccountInterface = require('../interfaces/vendorGatewayCreateAccount');
const { Artist } = require('../../models');

module.exports = class SaveArtistAccountService extends SaveArtistProfileService
{
    /** @param { VendorGatewayCreateAccountInterface } createGatewayAccountSvc */
    constructor(user) {
      // sending empty profile data - will be handled later when calling public interface
      super(user, {profile: {}});
    }

    async save(bankAccountData) {
      this.bankAccount = bankAccountData;
      this.ensureBankAccountIsValid();

      await this.lookupArtist();
      this.ensureArtistWasFound();

      this.ensureArtistCanConnectBankAccount()
        .parseBankAccountData()
        .assignArtistBankAccount();
      await this.saveArtist();

      this.initGatewayCreateAccountService();
      await this.createArtistGatewayAccount();
      this.assignArtistGatewayAccount();
      await this.saveArtist();
      this.sendConnectedAccountMail();
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

    ensureArtistCanConnectBankAccount() {
      return this;
    }

    initGatewayCreateAccountService() {
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
}