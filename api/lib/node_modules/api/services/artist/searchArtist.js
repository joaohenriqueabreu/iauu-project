const ArtistService = require('./base');
const BadRequestException = require('../../exception/bad');

module.exports = class SearchArtistProfileService extends ArtistService
{
    constructor(user) {
      super(user);
    }

    async search(id) {
      // need to override base with provided data (not the role_id from the user, but the one looking up)      
      this.id = id;
      await this.searchArtist();
      await this.ensureArtistWasFound();
      return this
    }
}
