const pagarme = require('pagarme');
const { Exception } = require("../../exception");
const PagarmeConnectService = require('./pagarmeConnect');

// This service should not be used by the backend - CREATED ONLY FOR TESTING PURPOSES
module.exports = class PagarmeCardHashExchangePaymentService {
  constructor(paymentMethod) {
    if (paymentMethod === undefined) { throw new Exception('Must provide payment method'); }
    
    this.paymentMethod = paymentMethod;

    this.pagarmeConnectSvc = new PagarmeConnectService();

  }

  ensurePaymentMethodIsValid() {
    // Validate payment method according to pagar.me rules
    // CC - https://docs.pagar.me/docs/realizando-uma-transacao-de-cartao-de-credito

    const validation = pagarme.validate({ card: this.paymentMethod });    
    return this;
  }

  async exchange() {
    this.ensurePaymentMethodIsValid();
    const apiClient = await this.pagarmeConnectSvc.connect();
    this.hash = await apiClient.security.encrypt(this.paymentMethod);
    return this;
  }

  getHash() {
    return this.hash;
  }
}