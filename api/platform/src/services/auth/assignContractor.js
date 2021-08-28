const AssignRoleService       = require('./assignRole');
const { Contractor }          = require('../../models');
const { BadRequestException } = require('@iauu/exceptions');

module.exports = class AssignContractorRoleService extends AssignRoleService
{
  constructor() {
    super();

    this.role = 'contractor';
  }

  async link(contractor_id) {
    console.log('Linking contractor to user...');
    await this.searchUserById(this.id);
    this.ensureUserWasFound()
      .ensureUserIsNotYetAssigned();
    await this.searchContractorById(contractor_id);
    this.ensureContractorWasFound()
      .assignUserToRole()
      .assignRoleToUser()
      .defaultRoleProfile()
      .copyReferralSource()
      .updateUserStatus();
    await this.saveRole();
    await this.saveUser();
    await this.searchUserById(this.user.id);
    await this.generateAccessToken();
    return this;
  }

  createRole() {
    this.roleInstance = new Contractor();
    return this;
  }

  async searchContractorById(id) {
    this.user.role = 'contractor';
    this.roleInstance = await Contractor.findById(id).populate('users');
    return this;
  }

  ensureContractorWasFound() {
    if (Contractor.notFound(this.roleInstance) || !this.roleInstance instanceof Contractor) {
      throw new BadRequestException('Organizador de eventos não reconhecido');
    }

    console.log('Contractor found...');
    return this;
  }

  assignRoleToUser() {
    console.log('Assigning user as contractor...');
    this.user.contractor = this.roleInstance.id;
    return this;
  }

  defaultRoleProfile() {
    this.roleInstance.name = this.user.name;
    return this;
  }
}