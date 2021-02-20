const faker = require('faker');

const BaseFactory = require('./base');
const AddressFactory = require('./address');
const ProposalFactory = require('./proposal');
const ArtistFactory = require('./artist');
const ContractorFactory = require('./contractor');
const { Presentation } = require('../../src/models');

module.exports = class PresentationFactory extends BaseFactory {

  manufacture() {
    const proposal = (new ProposalFactory()).getSeed();

    return new Presentation({
      fee: 0.12,
      address: (new AddressFactory).getSeed(),
      category: {
        name: faker.music.genre()
      },
      price: faker.random.number(1000000),
      proposal: proposal,
      artist: (new ArtistFactory()).getSeed(),
      contractor: (new ContractorFactory()).getSeed()
    });
  }
}