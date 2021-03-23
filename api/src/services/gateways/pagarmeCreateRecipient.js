require('../../config/env');
const { Exception } = require("../../exception");

const VendorGatewayCreateAccountInterface = require('../interfaces/vendorGatewayCreateAccount');
const PagarmeConnectService = require('./pagarmeConnect');
const PagarmeData = require('../../config/data/vendor/pagarme');
const { User, Artist } = require('../../models');
const { DocumentHelper } = require('../utils');
const { ManualPaymentRequiredException } = require('../../exception');

module.exports = class PagarmeCreateRecipientService extends VendorGatewayCreateAccountInterface {
  constructor(pagarmeBankAccountId) {
    super();
    if (pagarmeBankAccountId === undefined) { throw new Exception('Must provide existing bank account information.'); }
    
    this.pagarmeBankAccountId = pagarmeBankAccountId;
    this.pagarmeRecipientRequestData = {};
    this.pagarmeRecipient = {};

    this.pagarmeConnectSvc = new PagarmeConnectService();
  }

  async create(recipientData) {
    this.recipient = recipientData;

    this.ensureRecipientIsValid();
    await this.connectAPI();
    this.populateRequestData();
    await this.createPagarmeRecipient();

    return this.pagarmeRecipient;
  }

  ensureRecipientIsValid() {
    // if (! this.recipient instanceof Artist) {
    //   throw new Exception('Invalid recipient provided');
    // }

    if (! this.recipient.manager instanceof User) {
      throw new Exception('Recipient must have a manager');
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
      case 'CPF': return this.getIndividualData();
      case 'CNPJ': return this.getCompanyData();
      default: return {};
    }
  }

  getIndividualData() {
    return {
      type: PagarmeData.PAGARME_RECIPIENT_TYPE_INDIVIDUAL,
      document_number: DocumentHelper.formatDocument(this.recipient.document, false),
      name: this.recipient.name,
      email: this.recipient.email,
    }
  }

  getCompanyData() {
    return {
      type: PagarmeData.PAGARME_RECIPIENT_TYPE_CORPORATION,
      document_number: this.recipient.document,
      company_name: this.recipient.name,
      email: this.recipient.email,
      managing_partners: [{
        type: PagarmeData.PAGARME_RECIPIENT_TYPE_INDIVIDUAL,
        document_number: this.recipient.manager.document,
        name: this.recipient.manager.name,
        email: this.recipient.manager.email,
      }]
    }
  }

  async createPagarmeRecipient() {
    try {
      this.pagarmeRecipient = await this.apiClient.recipients.create(this.pagarmeRecipientRequestData);
    } catch (error) {
      throw new ManualPaymentRequiredException('Failed creating recipient', error.response.errors);
    }
    
    return this;
  }
}