const Artist = require('../../models/artist')
const ArtistService = require('./base')

module.exports = class SaveProfileService extends ArtistService
{
    constructor(user, data) {
      super(user)
      this.id = user.role_id
    }

    async lookup() {
      await this.lookupArtistWithProducts()
      await this.ensureArtistWasFound()
      return this
    }

    async lookupArtistWithProducts() {
      console.log('Searching for products...')
      this.artist = await Artist.findById(this.id).populate('products')
      return this
    }
}
