import Model from './model'

export default class Media extends Model {
  constructor(media) {
    super()
    this.type = ''
    this.name = ''
    this.subtitle = ''
    this.url = ''
    this.thumb = ''
    this.size = 0

    this.assign(media)
  }
}
