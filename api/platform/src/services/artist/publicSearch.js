const { Artist, Presentation }  = require('../../models')
const BaseService               = require('../base')
const { BadRequestException }   = require('iauu/exception');

module.exports = class PublicArtistProfileService extends BaseService
{
    constructor(user) {
      super()

      // if (data === undefined) {
      //   throw new BadRequestException('Data is required')
      // }

      this.artist = {}
    }

    async search(slug) {
      this.slug = slug;

      await this.searchArtist()
      this.ensureArtistWasFound()
      await this.calculateStats()
      return this
    }

    async searchArtist() {
      console.log('Searching for artist from slug...')      
      this.artist = await Artist.findOne({ slug: this.slug }).populate('users');
      return this;
    }

    ensureArtistWasFound() {      
      if (Artist.notFound(this.artist) || !this.artist instanceof Artist) {
        throw new Error('Artist not found...');
      }
  
      console.log('Artist found...')
      return this
    }

    async calculateStats() {
      const presentationsCount = await Presentation.countDocuments({ artist: this.artist.id, status: { $ne: 'proposal'}})

      this.artist.stats = { 
        score: this.artist.feedback_count,
        followers: this.artist.stats.followers, 
        presentations: presentationsCount 
      }

      return this
    }

    getArtist() {
      return this.artist
    }
}
