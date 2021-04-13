const ArtistService = require('./base')

module.exports = class SearchArtistProfileService extends ArtistService
{
    constructor(user, data) {
      super(user);

      this.id = user.role_id;
    }

    async search() {
      await this.searchArtistWithUsers();
      this.ensureArtistWasFound();
      return this;
    }
}
