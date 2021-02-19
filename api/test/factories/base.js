module.exports = class BaseFactory {
  constructor(numOfSeeds) {
    if(! this.manufacture) {
      throw new Error('Must implement manufacture interface');
    }

    if (numOfSeeds === undefined) { numOfSeeds = 1; }

    this.seeds = [];
    for (let i = 0; i < numOfSeeds; i++) {
      this.seeds.push(this.manufacture());
    }
  }

  getSeeds() {
    return this.seeds;
  }

  getSeed() {
    return this.seeds[0];
  }
}