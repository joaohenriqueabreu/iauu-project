import Model from './model'

export default class Product extends Model {
  constructor(product) {
    super()
    this.name = ''
    this.description = ''
    this.price = 0
    this.duration = 0
    this.documents = []
    this.medias = []
    this.items = []
    this.photo = ''

    this.assign(product)
  }
}
