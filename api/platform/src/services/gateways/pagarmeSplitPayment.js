const config = require('../../env');

const moment = require('moment');
const { PaymentData } = require('../../config/data');
const PagarmeData = require('../../config/data/vendor/pagarme');
const { DocumentHelper } = require('../../services/utils');

const PagarmeConnectService = require('./pagarmeConnect');
const { Exception, InvalidPaymentMethodProvidedException, FailedChargingPaymentMethodException, ManualPaymentRequiredException } = require('../../exception');
const VendorGatewayInterface = require('../interfaces/vendorGateway');
const { Artist } = require('../../models');

let PAGARME_PAYMENT_METHOD_MAP = [];
PAGARME_PAYMENT_METHOD_MAP[PaymentData.PAYMENT_METHOD_TYPE_CREDIT_CARD] = PagarmeData.PAYMENT_METHOD_TYPE_CREDIT_CARD;
PAGARME_PAYMENT_METHOD_MAP[PaymentData.PAYMENT_METHOD_TYPE_BOLETO] = PagarmeData.PAYMENT_METHOD_TYPE_BOLETO;
PAGARME_PAYMENT_METHOD_MAP[PaymentData.PAYMENT_METHOD_TYPE_PIX] = PagarmeData.PAYMENT_METHOD_TYPE_PIX;

module.exports = class PagarmeSplitPaymentService extends VendorGatewayInterface {
  constructor(paymentMethod) {
    super();

    if (paymentMethod === undefined || paymentMethod.type === undefined) {
      throw new Exception('Must provide payment method'); 
    }

    this.paymentMethod = paymentMethod;
    this.pagarmeTransactionRequestData = {};
    this.pagarmePaymentMethod = {
      type: '',
      params: {}
    }
    
    this.pagarmeConnectSvc = new PagarmeConnectService();
    this.paymentDocument = '';
  }

  async charge(payment) {
    this.payment = payment;

    await this.connectApi();
    this.ensurePaymentMethodIsValid()
      .ensurePaymentIsValid()
      .translatePaymentMethod()
      .buildTransactionObject();

    await this.createTransaction()
    this.validateResponse()
      .cleanupTransaction();

    return this.transaction;
  }

  async connectApi() {
    this.apiClient = await this.pagarmeConnectSvc.connect();
    return this;
  }

  ensurePaymentMethodIsValid() {
    // Validate payment method according to pagar.me rules
    // CC - https://docs.pagar.me/docs/realizando-uma-transacao-de-cartao-de-credito
    // Boleto - https://docs.pagar.me/docs/realizando-uma-transacao-de-boleto-bancario
    // PIX - ?
    
    if (this.paymentMethod.type === undefined || 
      (this.paymentMethod.type === PaymentData.PAYMENT_METHOD_TYPE_CREDIT_CARD && this.paymentMethod.hash === undefined)) {
      throw new InvalidPaymentMethodProvidedException();
    }

    return this;
  }

  ensurePaymentIsValid() {
    if (this.payment === undefined) {
      throw new Exception('Must provide a valid payment object.');
    }

    if (this.payment.amount <= 0) {
      throw new Exception('Payment amount cannot be zero.');
    }

    if (! this.payment.to instanceof Artist) {
      throw new Exception('Invalid payment recipient provided');
    }

    if (this.payment.to.account.gateway.id === undefined) {
      throw new ManualPaymentRequiredException('Artist has not connected to pagar.me account');
    }

    return this;
  }

  translatePaymentMethod() {
    this.pagarmePaymentMethod.type = PAGARME_PAYMENT_METHOD_MAP[this.paymentMethod.type];

    // Pagar.me só aceita 'números' como CPF
    this.paymentDocument = DocumentHelper.formatDocument(this.payment.to.document, false);

    if (this.pagarmePaymentMethod.type === PagarmeData.PAYMENT_METHOD_TYPE_CREDIT_CARD) {
      this.pagarmePaymentMethod.extraParams = {
        async: true, // Required for anti-fraud analysis
        card_hash: this.paymentMethod.hash
      }

      return this;
    }

    if (this.pagarmePaymentMethod.type === PagarmeData.PAYMENT_METHOD_TYPE_BOLETO) {
      this.pagarmePaymentMethod.extraParams = {
        async: false,
        capture: true,
      }

      return this;
    }

    if (this.pagarmePaymentMethod.type === PagarmeData.PAYMENT_METHOD_TYPE_PIX) {
      this.pagarmePaymentMethod.extraParams = {
        async: false,
        capture: true,
        pix_expiration_date: moment().add(7, 'days').format('YYYY-MM-DD').toString(),
        // TODO Check how this value is displayed for user
        pix_additional_fields: [{
          name: 'Quantidade',
          value: '2'
        }]
      }

      return this;
    }

    // Should never reach this point as we already validate payment method type
    throw new InvalidPaymentMethodProvidedException();
  }

  buildTransactionObject() {
    this.pagarmeTransactionRequestData = {
      payment_method: this.pagarmePaymentMethod.type,
      async: this.shouldRunApiInAsyncMode,
      amount: PagarmeSplitPaymentService.convertAmountToPagarmeFormat(this.payment.amount),
      installments: 1,
      postback_url: config.url.api + `/payments/${this.payment.id}/status/update`,
      customer: this.getPaymentCustomerInfo(),
      billing: this.getPaymentBillingInfo(),
      items: this.getPaymentItemsInfo(),
      split_rules: this.getPaymentSplitRules(),
      metadata: this.getPaymentMetadataInfo()
    }

    // Add additional params (like card_hash or pix data)
    this.pagarmeTransactionRequestData = {
      ...this.pagarmeTransactionRequestData,
      ...this.pagarmePaymentMethod.extraParams
    }

    return this;
  }

  static convertAmountToPagarmeFormat(amount) {
    return Math.round(amount * 100); // R$ 10,00 => 1000
  }

  getPaymentSplitRules() {
    const artistFee = PagarmeSplitPaymentService.convertAmountToPagarmeFormat((1 - this.payment.fee) * this.payment.amount);
    const ourFee = PagarmeSplitPaymentService.convertAmountToPagarmeFormat(this.payment.fee * this.payment.amount);

    return [
      { // Artist
        recipient_id: this.payment.to.account.gateway.id,
        amount: artistFee,
        liable: true, 
        charge_processing_fee: true, // Processing fee should be charged to the artist
      },
      { // Our Fee
        recipient_id: config.payment.gateway.recipientId,
        amount: ourFee,
        liable: true, 
        charge_processing_fee: false,
      }
    ]
  }

  getPaymentCustomerInfo() {
    return {
      external_id: this.payment.to.id,
      name: this.payment.to.name,
      type: PagarmeData.PAGARME_RECIPIENT_TYPE_INDIVIDUAL,
      country: 'br',
      email: this.payment.to.email,
      documents: [{
        type: 'cpf',
        number: this.paymentDocument
      }],
      phone_numbers: [this.payment.to.unformatted_phone],
      birthday: this.payment.to.birthday
    }
  }

  getPaymentBillingInfo() {
    return {
      name: this.payment.from.name,
      address: {
        country: this.payment.from.address.short_country.toLowerCase(),
        street: this.payment.from.address.street,
        street_number: this.payment.from.address.number || '01',
        state: this.payment.from.address.short_state.toLowerCase(),
        city: this.payment.from.address.city,
        neighborhood: this.payment.from.address.neighborhood,
        zipcode: this.payment.from.address.unformatted_zipcode
      }
    }
  }

  getPaymentShippingInfo() {
    // No shipping information
    return {}
  }

  getPaymentItemsInfo() {
    return [{
        id: '1',
        title: 'R2D2',
        unit_price: 300,
        quantity: 1,
        tangible: false
      }];
  }

  // Used by postback
  getPaymentMetadataInfo() {
    return {
      payment_id: this.payment.id
    };
  }

  async createTransaction() {
    try {
      this.transaction = await this.apiClient.transactions.create(this.pagarmeTransactionRequestData);
    } catch (error) {
      console.log(error.response.errors);
      throw new FailedChargingPaymentMethodException('Failed creating transaction', error.response.errors);
    }
    
    return this;
  }

  validateResponse() {
    if (this.transaction.object !== PagarmeData.PAGARME_RESPONSE_TYPE_TRANSACTION ||
        (this.transaction.payment_method === PagarmeData.PAYMENT_METHOD_TYPE_CREDIT_CARD && this.transaction.status !== PagarmeData.PAGARME_TRANSACTION_STATUS_PROCESSING) || 
        this.transaction.refuse_reason !== null) {
        throw new FailedChargingPaymentMethodException();
      }

    return this;
  }

  cleanupTransaction() {
    // customer, billing, shipping and items are redundant - no need store on payment model, only pagar.me return data is relevant
    delete(this.transaction.billing);
    delete(this.transaction.shipping);
    delete(this.transaction.items);
    delete(this.transaction.redundant);

    return this;
  }
}