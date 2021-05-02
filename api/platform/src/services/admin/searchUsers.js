const BaseService = require('../base')
const { User } = require('../../models')

module.exports = class SearchUsersService extends BaseService
{
    constructor(data) {
      super(data)

      if (data.search) {
        this.term = data.search
      }

      this.users = {}
    }

    async search() {
      await this.searchUsers()
      return this
    }

    async searchUsers() {
      const searchTermCondition = this.term !== undefined ? { $text: { $search: this.term } } : {}
      this.users = await User.find({ role: { $nin: ['admin'] }, ...searchTermCondition}).sort('-create_dt')
      return this
    }

    getUsers() {
      return this.users
    }
}
