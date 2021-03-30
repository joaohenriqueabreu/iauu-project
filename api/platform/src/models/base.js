class BaseModel {
  constructor(data) {
    // TODO merge Model and Structure base class constructors
    if (data !== undefined) {
      this.assign(data);
    }
  }

  assign(data) {
    if (data === undefined) { return; }

    for (const prop in data) {
      this[prop] = data[prop];
    }
  }
}

module.exports = BaseModel;