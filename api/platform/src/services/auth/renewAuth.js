const User = require('../../models/user')
const LoginUserService = require('./loginUser')
const GenerateTokenService = require('../auth/generateToken')
const UnauthorizedException = require('../../exception/unauthorized')

module.exports = class LoginAsUserService extends LoginUserService
{
    constructor(user) {
      super()
      this.id = user.id
    }

    async renew() {
      await this.searchUser()
      await this.validateNonPasswordLogin()
      await this.generateAccessToken()
      await this.saveUser()
      return this
    }
}
