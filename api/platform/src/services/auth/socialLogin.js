const AuthService = require('./auth')
const User = require('../../models/user')

module.exports = class SocialLogin extends AuthService {
  constructor(token) {
    super()
    this.token = token
    this.socialData = {}
  }

  async login() {
    this.socialData = await this.fetchProfile()
    await this.searchUserFromSocial()
    await this.generateAccessToken()
    await this.saveUser()
    return this
  }  
}
