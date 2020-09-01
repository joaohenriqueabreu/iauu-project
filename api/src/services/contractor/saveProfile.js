const ContractorService = require('./base')
const SaveUserProfileService = require('../auth/saveProfile')
const BadRequestException = require('../../exception/bad')

module.exports = class SaveContractorProfileService extends ContractorService
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
      await this.lookupContractor()
      this.ensureContractorWasFound()
        .sanitizeData()
        .populateModel()
      await this.saveContractor()
      return this
    }

    sanitizeData() {
      console.log('Data cleanup...')
      // Separate user data (ie: media), will be updated later
      this.userData = this.data['user']

      // Clenup sensitive data, null or not changed data
      delete this.data['user']
      delete this.data['_id']
      delete this.data['__v']

      for (let prop in this.data) {
        if (this.data[prop] === undefined || this.data[prop] === this.contractor[prop]) {
          delete this.data[prop]
        }
      }

      return this
    }

    populateModel() {
      for (let prop in this.data) {
        this.contractor[prop] = this.data[prop]
      }

      console.log('Contractor ready to save...')
      return this
    }
}
