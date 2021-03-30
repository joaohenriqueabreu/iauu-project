const faker = require('faker');
const moment = require('moment');

const BaseFactory = require('../base');

module.exports = class PagarmeCreditCardPaymentMethodFactory extends BaseFactory {
  make() {
    const expiry_date = moment(faker.date.future());
    return {
      type: 'cc',
      card_number: '4111111111111111',
      card_holder_name: faker.name.findName(),
      card_expiration_date: expiry_date.format('MMYY'),
      card_cvv: faker.finance.creditCardCVV()
    };
  }
}