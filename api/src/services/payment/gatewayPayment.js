const BaseService = require('../base');

module.exports = class GatewayPaymentService extends BaseService
{
    constructor(payment) {
      super();

      this.payment = payment;
    }

    async initiate() {

      return this;
    }
}
