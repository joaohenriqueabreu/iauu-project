const AuthService = require('./auth')
const ReferralService = require('../referral/referral')
const AssignRoleService = require('./assignRole')
const { User, Artist, Contractor } = require('../../models')
const BadRequestException = require('../../exception/bad')
const GenerateTokenService = require('./generateToken')

module.exports = class RegisterUserService extends AuthService {
  constructor(name, email, password) {
    super()
    
    if (!name || !email || !password) {
      throw new Error('Invalid user info...')
    }

    this.user.email = email
    this.user.name = name
    this.password = password
  }

  async register(referral, artist) {
    await this.checkUserExists()
    await this.encryptPassword(this.password)
    await this.generateAccessToken()
    this.generateVerificationToken()
      .generateReferralToken()
    await this.saveUser()
    await this.linkReferral(referral)
    await this.linkArtist(artist)

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

  async linkReferral(referral_token) {
    console.log('Checking if user was referred...')
    // No referral, move on
    if (referral_token === undefined || referral_token === null) { return }

    const referralSvc = new ReferralService(this.user, referral_token)
    try {
      await referralSvc.refer()
    } catch (error) {
      // do nothing
      console.log(error)
      console.log('Invalid referral link provided')
    }

    return this
  }

  async linkArtist(artist) {
    console.log('Checking if user was invited to artist...')
    // No referral, move on
    if (artist === undefined || artist === null) { return }

    // Decrypt id
    const artist_id = GenerateTokenService.decryptId(artist)
    const assignRoleSvc = new AssignRoleService(this.user, 'artist')
    try {
      await assignRoleSvc.linkArtist(artist_id)
    } catch (error) {
      // do nothing
      console.log(error)
      console.log('Invalid artist id provided')
    }

    return this
  }
}