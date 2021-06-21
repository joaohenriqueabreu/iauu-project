const BaseService             = require('../base');
const { BadRequestException } = require('iauu/exception');
const { User }                = require('../../models');

module.exports = class RegisterReferralSourceService extends BaseService
{
  constructor(user, token) {
    super()

    this.token    = token
    this.referred = user
    this.referrer = {}
  }

  async refer() {
    console.log('Validating referral token...')
    await this.searchUser()
    this.ensureUserWasFound()
      .assignReferral()

    await this.saveReferral()
    return this
  }

  async searchUser() {
    this.referrer = await User.findOne({ 'referral.token': this.token })
    return this
  }

  ensureUserWasFound() {
    if (User.notFound(this.referrer) || !this.referrer instanceof User) {
      throw new BadRequestException('Invalid token...')
    }

    console.log('Referrer found...')
    return this
  }

  assignReferral() {
    // TODO This naming does not look good
    this.referred.referral.from = this.referrer.id
    return this
  }

  async saveReferral() {
    console.log('Saving referral...')
    await this.referred.save()
    return this
  }
}
