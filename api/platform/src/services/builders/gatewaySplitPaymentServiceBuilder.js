const config = require('../../env');

const BaseServiceBuilder = require('./base');
const { PagarmeSplitPaymentService } = require('../gateways');

module.exports = class GatewaySplitPaymentServiceBuilder extends BaseServiceBuilder {
  build(data) {
    if (config.payment.gateway.name === 'pagarme') { 
      this.service = new PagarmeSplitPaymentService(data); 
      return this;
    }

    throw new Error('Payment Gateway config not provided');
  }

  getService() {
    return this.service;
  }
}