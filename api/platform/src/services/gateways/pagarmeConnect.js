const config = require('@iauu/env');
const pagarme = require('pagarme');
const { FailedAPIConnectionException } = require('../../exception');

module.exports = class PagarmeConnectService {
  constructor() {
    this.apiClient = {};
  }

  async connect() {
    await this.connectAPI();
    this.ensureAPIClientIsValid();

    return this.apiClient;
  }

  async connectAPI() {
    try {
      this.apiClient = await pagarme.client.connect({ api_key: config.payment.gateway.key });
    } catch (error) {
      console.log(error);
      throw new FailedAPIConnectionException();
    }

    return this;
  }

  ensureAPIClientIsValid() {
    if (this.apiClient === undefined) {
      throw new FailedAPIConnectionException();
    }

    return this;
  }
}