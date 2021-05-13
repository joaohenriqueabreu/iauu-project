const AuthService = require('./auth');

module.exports = class ValidateUserService extends AuthService
{
    constructor(id) {
      super();
      this.id = id;
    }

    async refresh() {
      await this.searchUserById(this.id)
      await this.generateUserPayload();
      return this;
    }

    getUserPayload() {
      return this.payload;
    }
}
