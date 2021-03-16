require('../../config/env');

const BaseServiceBuilder = require('./base');
const { PagarmeCreateAccountService } = require('../gateways');

module.exports = class GatewayCreateAccountServiceBuilder extends BaseServiceBuilder {
  build(data) {
    if (process.env.PAYMENT_GATEWAY === 'pagarme') { 
      this.service = new PagarmeCreateAccountService(data); 
      return this;
    }

    throw new Error('Payment Gateway config not provided');
  }

  getService() {
    return this.service;
  }
}