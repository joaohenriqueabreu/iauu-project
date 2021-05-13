const moment      = require('moment');
const AuthService = require('./auth');
const User        = require('../../models/user');
const { EVENTS }  = require('lib/events');
const { BadRequestException, UnauthorizedException } = require('lib/exception');

module.exports = class VerifyUserService extends AuthService {
  constructor(token, bypassExpiration) {
    super()
    
    this.bypassExpiration = bypassExpiration;
  }

  async verify(token) {
    this.token = token;

    console.log('Trying to verify...')
    await this.searchUserFromCredentials({ 'verification.token': this.token })
    await this.validateLogin();
    this.isTokenExpired();
    await this.generateAccessToken();
    this.setUserAsVerified()
      .updateUserStatus();
    await this.saveUser();

    this.emitEvent(EVENTS.USER_VERIFIED_EVENT, this.user);
    return this
  }

  async resend() {
    console.log('Resending verification token...');
    await this.searchUserFromCredentials({ 'verification.token': this.token });
    await this.validateLogin();
    this.generateVerificationToken()
      .renewIssueDt();
    await this.saveUser();

    this.emitEvent(EVENTS.USER_REGISTERED_EVENT, this.user);
    return this
  }

  async authorize() {
    console.log('Trying to verify...')
    await this.searchUserFromCredentials({ 'verification.token': this.token })
    await this.validateLogin()
    return this
  }  

  async validateLogin() {
    if (User.notFound(this.user)) {
      throw new BadRequestException('Invalid token');
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
}
