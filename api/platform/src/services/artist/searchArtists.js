const config        = require('iauu/env');
const { Artist }    = require('../../models');
const BaseService   = require('../base');
const LocationUtils = require('../utils/location');

// in meters
const searchDistance = {
  city: 50000,
  street: 5000
}

module.exports = class SearchArtistProfileService extends BaseService
{
    constructor(user) {
      super(user);

      this.conditions = {};
      this.artists    = [];
      this.offset     = 0;
      this.limit      = config.search.perPage;
    }

    async search(data) {
      this.extractSearchFilters(data)
        .buildBaseSearchConditions()
        .buildTermConditions()
        .buildLocationConditions()
        .buildQuerySorting();
      await this.searchArtists();
      return this;
    }

    extractSearchFilters(data) {
      // we can search without term
      if (data === undefined)                                       { return this; }
      if (data.term !== undefined && data.term.length > 0)          { this.term = data.term; }
      if (data.location !== undefined && data.location.length > 0)  { this.location = JSON.parse(data.location); }
      if (data.price !== undefined && data.price > 0)               { this.price = data.price; }
      if (data.sort !== undefined && data.sort.length > 0)          { this.sort = data.sort; }
      if (data.page !== undefined && data.page > 0)                 { this.offset = data.page * config.search.perPage; }
      return this;
    }

    buildBaseSearchConditions() {
      // Artist should have some basic information filled prior to search
       this.conditions = {
        ...this.conditions,
        ...{ name:            { $exists: true }},
        ...{ address:         { $exists: true }},
        ...{ 'category.name': { $exists: true }},
        ...{ 'products.0':    { $exists: true }},
      }

      return this;
    }

    buildTermConditions() {
      if (this.term === undefined) { return this; }

      this.conditions = {
        ...this.conditions,
        ...{ $text: { $search: this.term }}
      };

      return this;
    }

    buildLocationConditions() {
      if (typeof this.location !== 'object' || typeof this.location.location !== 'object') { return this; }
      console.log('Searching by location...');

      this.conditions = {
        ...this.conditions,
        ...{ 'address.location': { 
          $near: { $geometry: LocationUtils.parseLocation(this.location.location), $maxDistance: searchDistance.city }
        }}
      };

      return this;
    }

    buildQuerySorting() {
      return this;
    }

    async searchArtists() {
      console.log('Searching for artists by condition...');

      this.artists = await Artist.find(this.conditions)
        .skip(this.offset)
        .limit(this.limit);

      console.log('Found artists...');
      return this;
    }

    getArtists() {
      return this.artists;
    }
}
