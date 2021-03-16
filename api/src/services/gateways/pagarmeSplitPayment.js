require('../../config/env');

const moment = require('moment');
const { PaymentData } = require('../../config/data');
const PagarmeData = require('../../config/data/vendor/pagarme');

const PagarmeConnectService = require('./pagarmeConnect');
const { Exception, InvalidPaymentMethodProvidedException, FailedChargingPaymentMethodException } = require('../../exception');
const VendorGatewayInterface = require("../interfaces/vendorGateway");

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
    this.pagarmeTransactionRequestData = '';
    this.pagarmePaymentMethod = {
      type: '',
      params: {}
    }
    
    this.pagarmeConnectSvc = new PagarmeConnectService();
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

    return this;
  }

  translatePaymentMethod() {
    this.pagarmePaymentMethod.type = PAGARME_PAYMENT_METHOD_MAP[this.paymentMethod.type];

    if (this.pagarmePaymentMethod.type === PagarmeData.PAYMENT_METHOD_TYPE_CREDIT_CARD) {
      this.pagarmePaymentMethod.extraParams = {
        async: true, // Required for anti-fraud analysis
        card_hash: this.paymentMethod.hash
      }
    }

    if (this.pagarmePaymentMethod.type === PagarmeData.PAYMENT_METHOD_TYPE_BOLETO) {
      this.pagarmePaymentMethod.extraParams = {
        async: false,
        capture: true,
      }
    }

    if (this.pagarmePaymentMethod.type === PagarmeData.PAYMENT_METHOD_TYPE_PIX) {
      this.pagarmePaymentMethod.extraParams = {
        async: false,
        capture: true,
        pix_expiration_date: moment().add(1, 'days').format('YYYY-MM-DD').toString(),
        // TODO Check how this value is displayed for user
        pix_additional_fields: [{
          name: "Quantidade",
          value: "2"
        }]
      }
    }

    return this;
  }

  buildTransactionObject() {
    this.pagarmeTransactionRequestData = {
      payment_method: this.pagarmePaymentMethod.type,
      async: this.shouldRunApiInAsyncMode,
      amount: this.getConvertedAmountToPagarmeFormat(),
      installments: 1,
      postback_url: process.env.API_URL + `/payments/${this.payment.id}/status/update`,
      customer: this.getPaymentCustomerInfo(),
      billing: this.getPaymentBillingInfo(),
      items: this.getPaymentItemsInfo(),
      metadata: this.getPaymentMetadataInfo()
    }

    // Add additional params (like card_hash or pix data)
    this.pagarmeTransactionRequestData = {
      ...this.pagarmeTransactionRequestData,
      ...this.pagarmePaymentMethod.extraParams
    }

    return this;
  }

  getConvertedAmountToPagarmeFormat() {
    return this.payment.amount; // R$ 10,00 => 1000
  }

  getPaymentCustomerInfo() {
    return {
      external_id: this.payment.to.id,
      name: this.payment.to.name,
      type: 'individual',
      country: 'br',
      email: this.payment.to.email,
      documents: [{
        type: 'cpf',
        number: this.payment.to.document
      }],
      phone_numbers: [this.payment.to.phone],
      birthday: this.payment.to.birthday
    }
  }

  getPaymentBillingInfo() {
    return {
      name: this.payment.from.name,
      address: {
        country: this.payment.from.address.country,
        street: this.payment.from.address.street,
        street_number: this.payment.from.address.number,
        state: this.payment.from.address.state,
        city: this.payment.from.address.city,
        neighborhood: this.payment.from.address.neighborhood,
        zipcode: this.payment.from.address.zipcode
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
      throw new FailedChargingPaymentMethodException(error.response.errors);
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