const { Exception } = require("../../exception");
const VendorGatewayInterface = require("../interfaces/vendorGateway");

module.exports = class PagarmeSplitPaymentService extends VendorGatewayInterface {
  constructor(paymentMethod) {
    super();

    if (paymentMethod === undefined) { throw new Exception('Must provide payment method'); }
    
    this.paymentMethod = paymentMethod;
    // initial setup

  }

  ensurePaymentMethodIsValid() {
    // Validate payment method according to pagar.me rules
    // CC - https://docs.pagar.me/docs/realizando-uma-transacao-de-cartao-de-credito
    // Boleto - https://docs.pagar.me/docs/realizando-uma-transacao-de-boleto-bancario
    // PIX - ?

    return this;
  }

  charge() {
    this.ensurePaymentMethodIsValid();

    console.log('we should be calling pagarme API here');
    return 'this is a transaction id';
  }
}