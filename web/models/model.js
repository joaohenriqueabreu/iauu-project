export default class Model {
  constructor() {
    this.id = null
  }

  assign(assigned) {
    if (assigned === undefined) {
      return
    }

    for (const prop in assigned) {
      this[prop] = assigned[prop]
    }
  }
}
