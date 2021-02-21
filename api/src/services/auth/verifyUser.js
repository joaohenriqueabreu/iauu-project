const moment = require('moment')
const AuthService = require('./auth')
const User = require('../../models/user')
const SendMailService = require('../mail/sendMail')
const BadRequestException = require('../../exception/bad')
const UnauthorizedException = require('../../exception/unauthorized')

module.exports = class VerifyUserService extends AuthService {
  constructor(token, bypassExpiration) {
    super()
    this.token = token
    this.bypassExpiration = bypassExpiration
  }

  async verify() {
    console.log('Trying to verify...')
    await this.lookupUser({ 'verification.token': this.token })
    await this.validateLogin()
    this.isTokenExpired()
    await this.generateAccessToken()
    this.setUserAsVerified()
      .updateUserStatus()
    await this.saveUser()

    this.sendWelcomeMail()
    return this
  }

  async resend() {
    console.log('Resending verification token...')
    await this.lookupUser({ 'verification.token': this.token })
    await this.validateLogin()
    this.generateVerificationToken()
      .renewIssueDt()
    await this.saveUser()

    this.sendRegistrationMail()
    return this
  }

  async authorize() {
    console.log('Trying to verify...')
    await this.lookupUser({ 'verification.token': this.token })
    await this.validateLogin()
    return this
  }  

  async validateLogin() {
    if (User.notFound(this.user)) {
      throw new BadRequestException('Invalid token')
    }

    return this
  }

  isTokenExpired() {
    if (this.bypassExpiration) { return this }
    const now = moment()
    const tokenIssueDt = moment(this.user.verification.issued_at)
    console.log('Verifying token expiration date...')
    if (now.diff(tokenIssueDt, 'days') > 1) {
      throw new UnauthorizedException('Token expired')
    }

    return this
  }

  renewIssueDt() {
    this.user.verification.issued_at = Date.now()
    return this
  }

  setUserAsVerified() {
    this.user.verification.is_verified = true
    return this
  }

  async sendWelcomeMail() {
    const mailSvc = new SendMailService(this.user.email, 'Bem vindo a iauü')
    await mailSvc.buildBody('welcome', {
      user: this.user,
      url: this.generateVerificationUrl(),
    })
    await mailSvc.send()
    return this
  }
}
