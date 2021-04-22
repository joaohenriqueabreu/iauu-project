module.exports = class BaseFactory {
  static manufacture(manufactureModels = true, numOfSeeds = 1) {
    let seeds = [];
    for (let i = 0; i < numOfSeeds; i++) {
      const manufactured = this.make();
      seeds.push(manufactureModels ? this.makeModel(manufactured) : manufactured);
    }

    return numOfSeeds === 1 ? seeds[0] : seeds;
  }

  static make()      { throw new Error('Must implement make interface'); }
  static makeModel() { throw new Error('Must implement makeModel interface'); }
}