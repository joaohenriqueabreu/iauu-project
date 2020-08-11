const Artist = require('../../models/artist')
const BaseService = require('../base')
const mongoose = require('mongoose')

module.exports = class SearchArtistProfileService extends BaseService
{
    constructor(user, data) {
      super(user)
      console.log(data)
      if (data !== undefined) {
        // we can search without term
        if (data.term !== undefined) { this.term = data.term }
        if (data.location !== undefined) { this.location = data.location }
        if (data.price !== undefined) { this.price = data.price }
        if (data.sort !== undefined) { this.sort = data.sort }
      }

      this.conditions = {}
      this.artists = []
    }

    async search() {
      this.buildBaseSearchConditions()
        .buildTermConditions()
        .buildLocationConditions()
        .buildQuerySorting()
      await this.searchArtists()
      return this
    }

    buildBaseSearchConditions() {
      // Artist should have some basic information filled prior to search
       this.conditions = {
        ...this.conditions,
        ...{ name: { $exists: true }},
        ...{ address: { $exists: true }},
        ...{ 'category.name': { $exists: true }},
        ...{ 'products.0': { $exists: true }},
        ...{ 'users.0': { $exists: true }},
      }

      return this
    }

    buildTermConditions() {
      if (this.term === undefined) { return this }

      this.conditions = {
        ...this.conditions,
        ...{ $text: { $search: this.term }}
      }

      return this
    }

    buildLocationConditions() {
      return this
    }

    buildQuerySorting() {
      return this
    }

    async searchArtists() {
      mongoose.set('debug', true)
      console.log('Searching for artists by term...')
      
      this.artists = await Artist.find(this.conditions).populate('users')
      console.log('Found artists...')
      return this
    }

    getArtists() {
      return this.artists
    }
}
