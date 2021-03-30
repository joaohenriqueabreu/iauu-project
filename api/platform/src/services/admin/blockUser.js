const UserService = require('./user')

module.exports = class BlockUserService extends UserService
{
    async block() {
      await this.searchUser()
      this.ensureUserWasFound()
      this.blockUser()
      await this.saveUser()
      return this
    }

    blockUser() {
      this.user.status = 'blocked'
      return this
    }
}
