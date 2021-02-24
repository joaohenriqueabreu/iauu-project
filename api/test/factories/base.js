module.exports = class BaseFactory {
  constructor(numOfSeeds) {
    if(! this.make) {
      throw new Error('Must implement make interface');
    }

    if (numOfSeeds === undefined) { numOfSeeds = 1; }

    this.seeds = [];
    for (let i = 0; i < numOfSeeds; i++) {
      this.seeds.push(this.make());
    }
  }

  getSeeds() {
    return this.seeds;
  }

  getSeed() {
    return this.seeds[0];
  }
}