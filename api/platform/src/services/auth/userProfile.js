const AuthService = require('./auth')

module.exports = class UserProfileService extends AuthService
{
    constructor(user, data) {
      super(user)
      this.id = user.id
    }

    async search() {
      await this.searchUserById(this.id)
      return this
    }

    async save() {
      await this.searchUserById(this.id)
      return this
    }
}
