const faker = require('faker');

const BaseFactory = require('./base');
const AddressFactory = require('./address');
const ProposalFactory = require('./proposal');
const ArtistFactory = require('./artist');
const ContractorFactory = require('./contractor');
const { Presentation } = require('../../src/models');

module.exports = class PresentationFactory extends BaseFactory {
  constructor(numOfSeeds) {
    super(numOfSeeds);
  }

  manufacture() {
    const proposal = (new ProposalFactory()).getSeed();

    return new Presentation({
      fee: faker.random.float(0.5),
      address: (new AddressFactory).getSeed(),
      category: {
        name: faker.music.genre()
      },
      proposal: proposal,
      artist: (new ArtistFactory()).getSeed(),
      contractor: (new ContractorFactory()).getSeed()
    });
  }
}