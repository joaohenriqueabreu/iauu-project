const Artist = require('../../models/artist')
const ArtistService = require('./base')
const SaveUserProfileService = require('../auth/saveProfile')
const BadRequestException = require('../../exception/bad')

const slugfy = (value) => {
  return value.toLowerCase().replace(' ', '-')
}

module.exports = class SaveArtistProfileService extends ArtistService
{
    constructor(user, data) {
      super(user)

      if (data === undefined) {
        throw new BadRequestException('Data is required')
      }

      this.data = data.profile
      this.userData = {}
    }

    async save() {
      await this.lookupArtist()
      await this.ensureArtistWasFound()
      await this.sanitizeData()
      await this.populateSlug(0)
      await this.populateModel()
      // await this.fetchSocialData()
      await this.saveArtist()
      return this
    }

    async lookupArtist() {
      console.log('Searching for artist...')
      this.artist = await Artist.findById(this.id).populate('users')
      return this
    }

    sanitizeData() {
      console.log('Data cleanup...')
      // Clenup sensitive data, null or not changed data
      delete this.data['users']
      delete this.data['_id']
      delete this.data['__v']
      delete this.data['slug']

      for (let prop in this.data) {
        if (this.data[prop] === undefined || this.data[prop] === this.artist[prop]) {
          delete this.data[prop]
        }
      }

      return this
    }

    async populateSlug(suffix) {
      if (this.data['name'] === undefined ||
        this.data['name'] === this.artist.name) {
        console.log('No name changes...')
        return this
      }

      let slug = slugfy(this.data['name'])

      // Assign suffix if any
      if (suffix > 0) {
        slug = `${slug}-${suffix}`
      }

      console.log(`Checking if slug ${slug} exists...`)
      // Verify if slug exists
      if (await Artist.exists({ slug })) {
        console.log('Found existing slug...')
        return this.populateSlug(++suffix)
      }

      this.artist.slug = slug
      return this
    }

    populateModel() {
      for (let prop in this.data) {
        this.artist[prop] = this.data[prop]
      }      

      console.log('Artist ready to save...')
      return this
    }
}
