const AuthService = require('./auth')
const ReferralService = require('../referral/referral')
const { User, Artist, Contractor } = require('../../models')
const BadRequestException = require('../../exception/bad')

module.exports = class RegisterUserService extends AuthService {
  constructor(name, email, password, referralToken) {
    super()
    
    if (!name || !email || !password) {
      throw new Error('Invalid user info...')
    }

    this.user.email = email
    this.user.name = name
    this.password = password
    this.referral_token = referralToken
  }

  async register() {
    await this.checkUserExists()
    await this.encryptPassword(this.password)
    await this.generateAccessToken()
    this.generateVerificationToken()
      .generateReferralToken()
    await this.saveUser()
    await this.linkToReferrer()

    // Do not await for send mail, just start process, it is taking >3s to complete
    this.sendRegistrationMail()
    console.log('Registered user...')
    return this
  }

  async checkUserExists() {
    const exists = await User.exists({ email: this.user.email })
    if (exists) {
      throw new BadRequestException('User exists...')
    }

    return this
  }

  async linkToReferrer() {
    console.log('Checking if user was referred...')
    // No referral, move on
    if (this.referral_token === undefined) { return }

    const referralSvc = new ReferralService(this.user, this.referral_token)
    try {
      await referralSvc.refer()
    } catch (error) {
      // do nothing
      console.log(error)
      console.log('Invalid referral link provided')
    }

    return this
  }
}