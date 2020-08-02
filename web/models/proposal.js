import Model from './model'
import Artist from './artist'
import Contractor from './contractor'

export default class Presentation extends Model {
  constructor(proposal) {
    super()
    this.id = null
    this.status = null
    this.artist = new Artist()
    this.contractor = new Contractor()
    this.timeslots = []

    this.assign(proposal)
  }
}
