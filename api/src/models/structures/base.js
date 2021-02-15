class BaseStructure {
  constructor(data) {
    this.assign(data);
  }

  assign(data) {
    if (data === undefined) { return; }

    for (const prop in data) {
      this[prop] = data[prop];
    }
  }
}

module.exports = BaseStructure;