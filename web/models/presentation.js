import Model from './model'
// import Artist from './artist'
// import Contractor from './contractor'
// import Proposal from './proposal'
// import Timeslot from './timeslot'

export default class Presentation extends Model {
  constructor(presentation) {
    super()

    this.assign(presentation)
  }
}
