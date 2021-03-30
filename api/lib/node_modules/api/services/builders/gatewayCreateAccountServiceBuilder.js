const config = require('../../env');

const BaseServiceBuilder = require('./base');
const { PagarmeCreateAccountService } = require('../gateways');

module.exports = class GatewayCreateAccountServiceBuilder extends BaseServiceBuilder {
  build(data) {
    if (config.payment.gateway.name === 'pagarme') { 
      this.service = new PagarmeCreateAccountService(data); 
      return this;
    }

    throw new Error('Payment Gateway config not provided');
  }

  getService() {
    return this.service;
  }
}