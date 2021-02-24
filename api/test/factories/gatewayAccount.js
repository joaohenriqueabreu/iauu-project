const faker = require('faker');
const BaseFactory = require('./base');
const GatewayAccount = require('../../src/models/schemas/gatewayAccount');

module.exports = class GatewayAccountFactory extends BaseFactory {
  make() {
    return new GatewayAccount({
      name: faker.name.findName(),
      email: faker.internet.email(),
      document: faker.random.number(8),
      account_id: faker.random.alphaNumeric(16)
    });
  }
}