require('../../config/env');
const pagarme = require('pagarme');
const { Exception } = require("../../exception");

// This service should not be used by the backend - CREATED ONLY FOR TESTING PURPOSES
module.exports = class PagarmeCardHashExchangePaymentService {
  constructor(paymentMethod) {
    if (paymentMethod === undefined) { throw new Exception('Must provide payment method'); }
    
    this.paymentMethod = paymentMethod;    

  }

  ensurePaymentMethodIsValid() {
    // Validate payment method according to pagar.me rules
    // CC - https://docs.pagar.me/docs/realizando-uma-transacao-de-cartao-de-credito
    // Boleto - https://docs.pagar.me/docs/realizando-uma-transacao-de-boleto-bancario
    // PIX - ?

    const validation = pagarme.validate({ card: this.paymentMethod });    
    return this;
  }

  async exchange() {
    this.ensurePaymentMethodIsValid();
    const client = await pagarme.client.connect({ encryption_key: process.env.PAGARME_SECRET_KEY });
    this.hash = await client.security.encrypt(this.paymentMethod);
    return this;
  }

  getHash() {
    return this.hash;
  }
}