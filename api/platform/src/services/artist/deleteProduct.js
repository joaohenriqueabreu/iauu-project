const _ = require('lodash');
const ArtistService = require('./base');
const BadRequestException = require('../../exception/bad');

module.exports = class DeleteProductService extends ArtistService
{
    constructor(user) {
      super(user);
    }

    async delete(id) {
      this.productId = id;

      await this.searchArtist();
      this.ensureArtistWasFound()
        .ensureProductExists();
      await this.deleteProduct();
      await this.saveArtist();
      return this;
    }

    ensureProductExists() {
      console.log('Checking if product exists...');
      const self  = this;
      const index = _.findIndex(this.artist.products, (product) => product.id === self.productId);

      if (index === -1) {
        throw new BadRequestException('Invalid product');
      }
      
      return this;
    }

    async deleteProduct() {
      console.log('Deleting product...');
      await this.artist.products.pull(this.productId);
      return this;
    }
}
