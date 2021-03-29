const { Artist } = require('../../models');
const ArtistService = require('./base');

module.exports = class SaveProfileService extends ArtistService
{
    constructor(user, data) {
      super(user);  
    }

    async search() {
      await this.searchArtistWithUsers();
      await this.ensureArtistWasFound();
      return this;
    }

    async searchArtistWithUsers() {
      console.log('Searching for users...');
      this.artist = await Artist.find({ $or: [{ _id: this.artistId }, { user: this.userId }] })
        .populate('products');

      return this;
    }
}
