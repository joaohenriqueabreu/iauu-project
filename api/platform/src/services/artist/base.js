const { Artist }  = require('../../models');
const BaseService = require('../base');

module.exports = class ArtistService extends BaseService
{
    constructor(user) {
      super(user);
      this.artist = {};

      if (user === undefined) { return; }

      this.id     = user.role_id;
      this.userId = user.id;
    }

    async searchArtist() {
      console.log('Searching for artist...');
      this.artist = await Artist.findById(this.id);
      return this;
    }

    async searchArtistWithUsers() {
      console.log('Searching for artist with members...');
      this.artist = await Artist.findById(this.id).populate({ path: 'users', select: 'name email photo' });
      return this;
    }

    ensureArtistWasFound() {
      if (Artist.notFound(this.artist) || ! this.artist instanceof Artist) {
        throw new Error('Artist not found...');
      }
  
      console.log('Artist found...');
      return this;
    }

    async saveArtist() {
      if (this.artist.isModified) {
        await this.artist.save();
        console.log('Artist saved...');
      }
      
      return this;
    }

    getArtist() {
      return this.artist;
    }

    getProducts() {
      return this.artist.products;
    }
}
