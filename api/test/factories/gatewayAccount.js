const faker = require('faker');
const BaseFactory = require('./base');
const GatewayAccount = require('../../src/models/schemas');

module.exports = class GatewayAccountFactory extends BaseFactory {
  manufacture() {
    return new GatewayAccount({
      name: faker.name.findName(),
      email: faker.name.email(),
      document: faker.random.number(8),
      account_id: faker.random.alphaNumeric(16)
    });
  }
}