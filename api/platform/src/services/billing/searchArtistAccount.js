const SearchService = require('../search');
const { ArtistAccount } = require('../../models');
const { BadRequestException } = require('../../exception');

module.exports = class SearchArtistAccountService extends SearchService {
  constructor() {
    super();

    this.artist = {};
  }
  async search(id) {
    this.id = id;
    await this.searchArtistAccount();
    this.ensureArtistAccountWasFound();
    return this;
  }

  async searchArtistAccount() {
    this.artist = await ArtistAccount.findOne({ source_id: this.id });
    return this;
  }

  ensureArtistAccountWasFound() {
    if (this.shouldFailWhenNotFound && (!this.artist instanceof ArtistAccount || ArtistAccount.notFound(this.artist))) {
      throw new BadRequestException('Artist Account not found');
    }

    return this;
  }

  getArtist() {
    return this.artist;
  }

  getAccount() {
    return this.artist != null
      ? this.artist.protected_account_data
      : {};
  }
}