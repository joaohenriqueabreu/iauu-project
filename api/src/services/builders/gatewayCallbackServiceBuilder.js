require('../../config/env');

const BaseServiceBuilder = require('./base');
const { PagarmeUpdatePaymentStatusService } = require('../gateways');

module.exports = class GatewayCallbackServiceBuilder extends BaseServiceBuilder {
  build(data) {
    if (process.env.PAYMENT_GATEWAY === 'pagarme') { 
      this.service = new PagarmeUpdatePaymentStatusService(data); 
      return this;
    }

    throw new Error('Payment Gateway config not provided');
  }

  getService() {
    return this.service;
  }
}