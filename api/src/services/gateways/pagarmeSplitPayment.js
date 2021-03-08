require('../../config/env');

const pagarme = require('pagarme');
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
      // postback_url: 'http://localhost',d
      customer: this.getPaymentCustomerInfo(),
      billing: this.getPaymentBillingInfo(),
      // shipping: this.getPaymentShippingInfo(),
      items: this.getPaymentItemsInfo()
    }

    return this;
  }

  getConvertedAmountToPagarmeFormat() {
    return this.payment.amount; // R$ 10,00 => 1000
  }

  getPaymentCustomerInfo() {
    return {
      external_id: "#3311",
      name: "Morpheus Fishburne",
      type: "individual",
      country: "br",
      email: "mopheus@nabucodonozor.com",
      documents: [
        {
          "type": "cpf",
          "number": "55555555555"
        }
      ],
      phone_numbers: ["+5511999998888", "+5511888889999"],
      birthday: "1965-01-01"
    }
  }

  getPaymentBillingInfo() {
    return {
      'name': 'Nome do pagador',
      'address': {
        country: 'br',
        street: 'Avenida Brigadeiro Faria Lima',
        street_number: '1811',
        state: 'sp',
        city: 'Sao Paulo',
        neighborhood: 'Jardim Paulistano',
        zipcode: '01451001'
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
      throw new FailedChargingPaymentMethodException(error.response.errors);
    }
    
    return this;
  }

  validateResponse() {
    if (this.transaction.object !== 'transaction' ||
        this.transaction.status !== 'processing' || 
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