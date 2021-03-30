const Artist = require('../../models/artist')
const Presentation = require('../../models/presentation')
const BaseService = require('../base')
const BadRequestException = require('../../exception/bad')

module.exports = class SearchArtistProfileService extends BaseService
{
    constructor(user, data) {
      super()

      if (data === undefined) {
        throw new BadRequestException('Data is required')
      }

      this.slug = data.slug
      this.artist = {}
    }

    async search() {
      await this.searchArtist()
      this.ensureArtistWasFound()
      await this.calculateStats()
      return this
    }

    async searchArtist() {
      console.log('Searching for artist from slug...')      
      this.artist = await Artist.findOne({ slug: this.slug }).populate('users')
      return this
    }

    ensureArtistWasFound() {      
      if (Artist.notFound(this.artist) || !this.artist instanceof Artist) {
        throw new Error('Artist not found...')
      }
  
      console.log('Artist found...')
      return this
    }

    async calculateStats() {
      const presentationsCount = await Presentation.countDocuments({ artist: this.artist.id, status: { $ne: 'proposal'}})
      console.log(presentationsCount)

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
