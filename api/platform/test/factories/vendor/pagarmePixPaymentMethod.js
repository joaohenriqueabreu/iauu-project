const faker = require('faker');

const BaseFactory = require('../base');

module.exports = class PagarmeBoletoPaymentMethodFactory extends BaseFactory {
  make() {
    return {
      card_hash: faker.random.alphaNumeric(16),
    };
  }
}