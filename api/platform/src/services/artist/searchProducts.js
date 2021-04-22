const { Artist }    = require('../../models');
const ArtistService = require('./base');

module.exports = class SearchProductsService extends ArtistService
{
    constructor(id) {
      super();

      this.id = id;
    }

    async search() {
      await this.searchArtistWithProducts();
      this.ensureArtistWasFound();
      return this;
    }

    async searchArtistWithProducts() {
      console.log('Searching for products...');
      this.artist = await Artist.findById(this.id).populate('products');
      return this
    }
}
