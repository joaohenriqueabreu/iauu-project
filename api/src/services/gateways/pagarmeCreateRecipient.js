require('../../config/env');
const { Exception } = require("../../exception");

const VendorGatewayCreateSplitAccountInterface = require('../interfaces/vendorGatewayCreateSplitAccount');
const PagarmeConnectService = require('./pagarmeConnect');
const PagarmeData = require('../../config/data/vendor/pagarme');
const { Artist } = require('../../models');
const { DocumentHelper } = require('../../utils');
const { ManualPaymentRequiredException } = require('../../exception');

module.exports = class PagarmeCreateAccountService extends VendorGatewayCreateSplitAccountInterface {
  constructor(pagarmeBankAccountId, recipientData) {
    super();
    if (pagarmeBankAccountId === undefined || recipientData === undefined) { throw new Exception('Must provide existing bank account information.'); }
    
    this.recipient = recipientData;
    this.pagarmeBankAccountId = pagarmeBankAccountId;
    this.pagarmeRecipientRequestData = {};
    this.pagarmeRecipient = {};

    this.pagarmeConnectSvc = new PagarmeConnectService();
  }

  async create() {
    this.ensureRecipientIsValid();
    await this.connectAPI();
    this.populateRequestData();
    await this.createPagarmeRecipient();

    return this.pagarmeRecipient;
  }

  ensureRecipientIsValid() {
    if (! this.recipient instanceof Artist) {
      throw new Exception('Invalid recipient provided');
    }

    return this;
  }

  async connectAPI() {
    this.apiClient = await this.pagarmeConnectSvc.connect();
    return this;
  }

  populateRequestData() {
    this.pagarmeRecipientRequestData = {
      bank_account_id: this.pagarmeBankAccountId,
      postback_url: process.env.API_URL + `/artists/${this.recipient.id}/recipient/status/update`,
      register_information: this.getRecipientPersonalData()
    }
    
    return this;
  }

  getRecipientPersonalData() {
    switch (DocumentHelper.getDocumentType(this.recipient.document)) {      
      case 'CPF': return getIndividualData();
      case 'CNPJ': return getCompanyData();
      default: return { };
    }
  }

  getIndividualData() {
    return {}
  }

  getCompanyData() {
    return {}
  }

  async createPagarmeRecipient() {
    try {
      this.pagarmeRecipient = await this.apiClient.recipients.create(this.pagarmeRecipientRequestData);
      console.log(this.pagarmeRecipient);
    } catch (error) {
      console.log(error.response.errors);
      throw new ManualPaymentRequiredException('Failed creating recipient');
    }
    
    return this;
  }
}