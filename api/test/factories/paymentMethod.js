const faker = require('faker');

const BaseFactory = require('./base');

module.exports = class PaymentMethodFactory extends BaseFactory {

  // TODO abstract - currently using pagar.me format
  manufacture() {
    return {
      card_hash: faker.random.alphaNumeric(16),
    };
  }
}