require('../../config/env');
const { Exception } = require("../../exception");

const VendorGatewayCreateSplitAccountInterface = require('../interfaces/vendorGatewayCreateSplitAccount');
const PagarmeConnectService = require('./pagarmeConnect');
const PagarmeData = require('../../config/data/vendor/pagarme');
const { ManualPaymentRequiredException } = require('../../exception');
const { BankAccountHelper } = require('../utils');

module.exports = class PagarmeCreateAccountService extends VendorGatewayCreateSplitAccountInterface {
  constructor(artistBankAccount) {
    super();
    if (artistBankAccount === undefined) { throw new Exception('Must provide artist bank account information.'); }
    
    this.artistBankAccount = artistBankAccount;
    this.pagarmeAccountData = {};
    this.pagarmeAccount = {};

    this.pagarmeConnectSvc = new PagarmeConnectService();
  }

  async create() {
    await this.connectAPI();
    await this.ensureBankAccountIsValid();
    this.translateAccounts();
    await this.createPagarmeAccount();

    return this.pagarmeAccount;
  }

  async connectAPI() {
    this.apiClient = await this.pagarmeConnectSvc.connect();
    return this;
  }

  async ensureBankAccountIsValid() {
    if (this.artistBankAccount.institution === undefined || 
      this.artistBankAccount.agency === undefined ||
      this.artistBankAccount.number === undefined ||
      this.artistBankAccount.number_digit == undefined) {
      throw new ManualPaymentRequiredException('Missing required bank account information.');
    }

    this.bankInstitutionData = await BankAccountHelper.getInstitutionData(this.artistBankAccount.institution);
    if (this.bankInstitutionData === undefined) {
      throw new ManualPaymentRequiredException('Invalid institution provided.');
    }

    return this;
  }

  translateAccounts() {
    this.pagarmeAccountData = {
      bank_code: this.bankInstitutionData.code,
      agencia: this.artistBankAccount.agency,
      conta: this.artistBankAccount.number,
      conta_dv: this.artistBankAccount.number_digit,
      document_number: this.artistBankAccount.document,
      legal_name: this.artistBankAccount.legal_name,
      type: PagarmeData.PAGARME_BANK_ACCOUNT_TYPE_CONTA_CORRENTE // TODO only accepting conta corrente for now
    }

    return this;
  }

  async createPagarmeAccount() {
    try {
      this.pagarmeAccount = await this.apiClient.bankAccounts.create(this.pagarmeAccountData);
    } catch (error) {
      throw new ManualPaymentRequiredException('Failed creating user bank account', error.response.errors);
    }
    
    return this;
  }
}