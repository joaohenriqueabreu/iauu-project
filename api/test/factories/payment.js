const faker = require('faker');

const Payment = require('../../src/models/schemas/payment');
const BaseFactory = require('./base');
const ContractorFactory = require('./contractor');
const ArtistFactory = require('./artist');
const PaymentMethodFactory = require('./paymentMethod');

module.exports = class PaymentFactory extends BaseFactory {
  make() {
    const amount = faker.random.number(1000000);
    const fee = 0.12;

    return new Payment({
      // id: faker.random.alphaNumeric(16),
      from: (new ContractorFactory()).getSeed(),
      to: (new ArtistFactory()).getSeed(),
    
      fee: fee,
      amount: amount,
      net_amount: amount * (1 - fee),
      paid_amount: 0,
      
      status: 'pending',
      notes: faker.lorem.sentences(3),
      method: (new PaymentMethodFactory()).getSeed()
    });
  }
}