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

  static notItems(items, products) {
    // this.$array.uniq(this.$array.flatten(arrs))
    const allItems = []
    products.forEach((product) => {
      allItems.push(product.items)
    })

    return this.$array.difference(this.$array.uniq(this.$array.flatten(allItems)), items)
  }
}
