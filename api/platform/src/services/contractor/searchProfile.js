const Contractor = require('../../models/contractor')
const ContractorService = require('./base')

module.exports = class SearchContractorProfileService extends ContractorService
{
    constructor(user, data) {
      super(user)
    }

    async search() {
      await this.searchContractor()
      await this.ensureContractorWasFound()
      return this
    }
}
