const faker = require('faker');

const BaseFactory = require('./base');

module.exports = class PaymentMethodFactory extends BaseFactory {

  make() {
    return {
      card_hash: faker.random.alphaNumeric(16),
    };
  }
}