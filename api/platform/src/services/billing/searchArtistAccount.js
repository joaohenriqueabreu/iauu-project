const SearchService = require('../search');
const { ArtistAccount } = require('../../models');
const { BadRequestException } = require('../../exception');

module.exports = class SearchArtistAccountService extends SearchService {
  constructor() {
    super();

    this.artistAccount = {};
  }
  async search(id) {
    this.id = id;
    await this.searchArtistAccount();
    this.ensureArtistAccountWasFound();
    return this;
  }

  async searchArtistAccount() {
    this.artistAccount = await ArtistAccount.findOne({ source_id: this.id });
    return this;
  }

  ensureArtistAccountWasFound() {
    if (this.shouldFailWhenNotFound && (!this.artistAccount instanceof ArtistAccount || ArtistAccount.notFound(this.artistAccount))) {
      throw new BadRequestException('Artist Account not found');
    }

    return this;
  }

  getArtistAccount() {
    return this.artistAccount;
  }

  getAccount() {
    return this.artistAccount != null
      ? this.artistAccount.protected_account_data
      : {};
  }
}