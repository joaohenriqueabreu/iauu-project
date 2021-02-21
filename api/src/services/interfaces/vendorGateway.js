module.exports = class VendorGatewayInterface {
  constructor() { }

  charge() { throw new Error('Must implement charge interface'); }
  ensurePaymentMethodIsValid() { throw new Error('Must implement ensurePaymentMethodIsValid interface'); }
}