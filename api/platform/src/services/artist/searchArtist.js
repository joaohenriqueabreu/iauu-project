const ArtistService = require('./base');

module.exports = class SearchArtistService extends ArtistService
{
    constructor(user) {
      super(user);
    }

    async search(id) {
      // need to override base with provided data (not the role_id from the user, but the one looking up)      
      this.id = id;
      await this.searchArtist();
      this.ensureArtistWasFound();
      return this
    }
}
