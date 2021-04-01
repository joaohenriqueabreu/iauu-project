const PagarmeCreateBankAccountService = require('./pagarmeCreateBankAccount');
const PagarmeCreateRecipientService = require('./pagarmeCreateRecipient');
const { Exception, BadRequestException } = require('../../exception');
const VendorGatewayCreateAccountInterface = require('../interfaces/vendorGatewayCreateAccount');
const { Artist } = require('../../models');

module.exports = class PagarmeCreateAccountService extends VendorGatewayCreateAccountInterface {
  constructor(artist) {
    super();

    if (artist === undefined) { throw new Exception('Must provide Artist information for creating recipient.'); }

    this.artist = artist;
    this.pagarmeCreateBankAccountSvc = new PagarmeCreateBankAccountService();
    
    this.pagarmeBankAccount = {};
    this.pagarmeRecipient = {};
  }

  async create(bankAccountData) {
    this.bankAccount = bankAccountData;

    this.ensureUserIsValid();
    await this.createGatewayBankAccount();
    this.ensurePagarmeBankAccountIsValid()
      .initCreateRecipientService()
      .assignValidRecipientData();

    await this.createGatewayRecipient();
    return this.pagarmeRecipient;
  }

  ensureUserIsValid() {
    if (! this.artist instanceof Artist) {
      throw new BadRequestException('Only artists can connect bank accounts');
    }

    return this;
  }

  ensurePagarmeBankAccountIsValid() {
    // No validation for now
    return this;
  }

  async createGatewayBankAccount() {
    this.pagarmeBankAccount = await this.pagarmeCreateBankAccountSvc.create(this.bankAccount);
    return this;
  }

  initCreateRecipientService() {
    this.pagarmeCreateRecipientSvc = new PagarmeCreateRecipientService(this.pagarmeBankAccount.id);
    return this;
  }

  assignValidRecipientData() {
    // Pagar.me requires that the document provided to create recipient to be the same as the one provided to create the bank account
    this.artist.document = this.bankAccount.document;

    // If artist has no company mail, use manager's
    this.artist.email = this.artist.email !== undefined ? this.artist.email : this.artist.manager.email;
    return this;
  }

  async createGatewayRecipient() {
    this.pagarmeRecipient = await this.pagarmeCreateRecipientSvc.create(this.artist);
    return this;
  }

}