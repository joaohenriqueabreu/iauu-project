import Model from './model'
import User from './user'
import Media from './media'

export default class Artist extends Model {
  constructor(artist) {
    super()
    this.id = null
    this.user = new User()
    this.name = ''
    this.company_name = ''
    this.is_verified = ''
    this.photo = new Media()
    this.ratings = []
    this.medias = []

    this.assign(artist)
  }
}
