import Model  from './model'
import User from './user'
import Media from './media'

export default class Contractor extends Model {
  defaults() {
    return {
      id: null,
      user: new User(),
      photo: new Media()
    }
  }
}
