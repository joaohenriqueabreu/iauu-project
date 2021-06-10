const config = require('iauu/env');

const BaseServiceBuilder = require('./base');
const { PagarmeUpdatePaymentStatusService } = require('../gateways');

module.exports = class GatewayCallbackServiceBuilder extends BaseServiceBuilder {
  build(data) {
    if (config.payment.gateway.name === 'pagarme') { 
      this.service = new PagarmeUpdatePaymentStatusService(data); 
      return this;
    }

    throw new Error('Payment Gateway config not provided');
  }

  getService() {
    return this.service;
  }
}