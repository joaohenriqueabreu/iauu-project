require('../../config/env');

const pagarme = require('pagarme');
const PagarmeData = require('../../config/data/vendor/pagarme');

const { Exception, InvalidPaymentMethodProvidedException, FailedAPIConnectionException, FailedChargingPaymentMethodException } = require('../../exception');
const VendorGatewayInterface = require("../interfaces/vendorGateway");

module.exports = class PagarmeSplitPaymentService extends VendorGatewayInterface {
  constructor(paymentMethod) {
    super();

    if (paymentMethod === undefined || paymentMethod.type === undefined) {
      throw new Exception('Must provide payment method'); 
    }

    this.paymentMethod = paymentMethod;
  }

  async charge(payment) {
    this.payment = payment;

    this.ensurePaymentMethodIsValid()
      .ensurePaymentIsValid()
      .buildTransactionObject();

    await this.connectAPI();
    this.ensureAPIClientIsValid();
    await this.createTransaction()
    this.validateResponse()
      .cleanupTransaction();

    return this.transaction;
  }

  ensurePaymentMethodIsValid() {
    // Validate payment method according to pagar.me rules
    // CC - https://docs.pagar.me/docs/realizando-uma-transacao-de-cartao-de-credito
    // Boleto - https://docs.pagar.me/docs/realizando-uma-transacao-de-boleto-bancario
    // PIX - ?
    
    if (this.paymentMethod.type === 'cc' && this.paymentMethod.hash === undefined) {
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

  buildTransactionObject() {
    this.pagarmePaymentMethod = {
      payment_method: 'credit_card',
      async: true, // Required for antifraud analysis
      amount: this.getConvertedAmountToPagarmeFormat(),
      card_hash: this.paymentMethod.hash,
      installments: 1,
      postback_url: process.env.API_URL + `/payments/${this.payment.id}/status/update`,
      customer: this.getPaymentCustomerInfo(),
      billing: this.getPaymentBillingInfo(),
      items: this.getPaymentItemsInfo(),
      metadata: this.getPaymentMetadataInfo()
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

  async connectAPI() {
    try {
      this.apiClient = await pagarme.client.connect({ api_key: process.env.PAGARME_API_KEY });
    } catch (error) {
      console.log(error);
      throw new FailedAPIConnectionException();
    }

    return this;
  }

  ensureAPIClientIsValid() {
    if (this.apiClient === undefined) {
      throw new FailedAPIConnectionException();
    }

    return this;
  }

  async createTransaction() {
    try {
      this.transaction = await this.apiClient.transactions.create(this.pagarmePaymentMethod);
    } catch (error) {
      console.log(error.response.errors);
      throw new FailedChargingPaymentMethodException(error.response.errors);
    }
    
    return this;
  }

  validateResponse() {
    if (this.transaction.object !== PagarmeData.PAGARME_RESPONSE_TYPE_TRANSACTION ||
        this.transaction.status !== PagarmeData.PAGARME_TRANSACTION_STATUS_PROCESSING || 
        this.transaction.refuse_reason !== null ) {
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