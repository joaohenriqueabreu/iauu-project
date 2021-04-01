import Model  from './model'
import User from './user'
import Media from './media'

export default class Contractor extends Model {
  constructor(contractor) {
    super()
    this.id = null
    this.user = new User()
    this.assign(contractor)
  }
}
