require('../../config/env');

const BaseServiceBuilder = require('./base');
const { PagarmePaymentService } = require('../gateways');

module.exports = class GatewayServiceBuilder extends BaseServiceBuilder {
  build(data) {
    if (process.env.PAYMENT_GATEWAY === 'pagarme') { 
      this.service = new PagarmePaymentService(data); 
      return this;
    }

    throw new Error('Payment Gateway config not provided');
  }

  getService() {
    return this.service;
  }
}