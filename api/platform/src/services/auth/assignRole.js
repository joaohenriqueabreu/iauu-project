const AuthService                   = require('./auth');
const { User, Artist, Contractor }  = require('../../models');
const { 
  BadRequestException,
  CannotConstructAbstractClassException,
  InterfaceOrAbstractNotImplementedException,
} = require('@iauu/exceptions');
const { EVENTS }                    = require('@iauu/events');

module.exports = class AssignRoleService extends AuthService {
  constructor(id) {
    super();
    if (this.constructor === AssignRoleService) { throw new CannotConstructAbstractClassException(); }

    this.roleInstance = {};
  }

  async assign(id) {
    this.id = id;
    await this.searchUserById(this.id);
    this.ensureUserWasFound()
      .ensureUserIsNotYetAssigned()
      .createRole();

    await this.saveRole();
    await this.link(this.roleInstance.id);

    this.generateFirstStepsNotifications();
    return this;
  }

  // Abstract methods
  async link()        { throw new InterfaceOrAbstractNotImplementedException(); }
  async createRole()  { throw new InterfaceOrAbstractNotImplementedException(); }
  assignRoleToUser()  { throw new InterfaceOrAbstractNotImplementedException(); }

  ensureUserIsNotYetAssigned() {
    if (['contractor', 'artist'].includes(this.user.role)) {
      throw new BadRequestException('Usuário já associado a um artista ou organizador de eventos');
    }

    return this;
  }

  async saveRole() {
    await this.roleInstance.save();
    return this;
  }

  assignUserToRole() {
    if (this.roleInstance.members === undefined) { this.roleInstance.members = []; }
    this.roleInstance.members.push(this.user.id);

    // If there is no email assigned, make user's mail as role's main mail
    if (this.roleInstance.email === undefined) { this.roleInstance.email = this.user.email; }
    return this;
  }

  defaultRoleProfile() {
    return this;
  }

  copyReferralSource() {
    // Bring referral source data from user to role layer
    if (! this.user.was_referred_by_someone) { return this; }

    this.roleInstance.referral_source_id = this.user.referral.from;
    return this;
  }

  async generateShareUrls() {
    // TODO implement
    if (this.role !== 'artist') { return this; }
    return this;
  }

  async generateFirstStepsNotifications() {
    return this;
  }
}
