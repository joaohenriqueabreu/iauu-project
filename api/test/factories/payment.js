const faker = require('faker');

const BaseFactory = require('./base');
const ContractorFactory = require('./contractor');
const ArtistFactory = require('./artist');
const PaymentMethodFactory = require('./paymentMethod');

module.exports = class PaymentFactory extends BaseFactory {
  make() {
    const amount = faker.random.number(1000000);
    const fee = 0.12;
    return {
      from: (new ContractorFactory()).getSeed(),
      to: (new ArtistFactory()).getSeed(),
    
      amount: amount,
      fee: fee,
      net_amount: amount * (1 - fee),
      
      status: 'pending',
      notes: faker.lorem.sentences(3),
      method: (new PaymentMethodFactory()).getSeed()
    };
  }
}