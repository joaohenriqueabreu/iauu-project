const Artist = require('../../models/artist')
const ArtistService = require('./base')

module.exports = class SearchArtistProfileService extends ArtistService
{
    constructor(user, data) {
      super(user)
    }

    async search() {
      await this.lookupArtist()
      await this.ensureArtistWasFound()
      return this
    }
}
