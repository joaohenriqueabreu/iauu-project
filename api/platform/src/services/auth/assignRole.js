const AuthService                   = require('./auth');
const { User, Artist, Contractor }  = require('../../models');
const BadRequestException           = require('iauu/exception/bad');
const { EVENTS }                    = require('iauu/events');

module.exports = class AssignRoleService extends AuthService {
  constructor(data, role) {
    super();
    
    this.id = data.id;
    this.role = role;
    this.roleInstance = {};
  }

  async assign() {
    await this.searchUserById(this.id);
    this.ensureUserWasFound()
      .ensureUserIsNotYetAssigned()
      .createRole();
    await this.saveRole();

    if (this.role === 'artist') { await this.linkArtist(this.roleInstance.id); }
    if (this.role === 'contractor') { await this.linkContractor(this.roleInstance.id); }

    this.generateFirstStepsNotifications();
    return this;
  }

  async linkArtist(artist_id) {
    console.log('Linking artist to user...');
    await this.searchUserById(this.id);
    this.ensureUserWasFound()
      .ensureUserIsNotYetAssigned();
    await this.searchArtistById(artist_id);
    this.ensureArtistWasFound()
      .assignUserToRole()
      .assignRoleToUser()
      .updateUserStatus();
    await this.generateShareUrls();
    await this.saveRole();
    await this.saveUser();
    await this.searchUserById(this.user.id);
    await this.generateAccessToken();
    return this;
  }

  async linkContractor(contractor_id) {
    console.log('Linking contractor to user...');
    await this.searchUserById(this.id);
    this.ensureUserWasFound()
      .ensureUserIsNotYetAssigned();
    await this.searchContractorById(contractor_id);
    this.ensureContractorWasFound()
      .assignUserToRole()
      .assignRoleToUser()
      .defaultRoleProfile()
      .updateUserStatus();
    await this.saveRole();
    await this.saveUser();
    await this.searchUserById(this.user.id);
    await this.generateAccessToken();
    return this;
  }

  ensureUserIsNotYetAssigned() {
    if (['contractor', 'artist'].includes(this.user.role)) {
      throw new BadRequestException('Usuário já associado a um artista ou organizador de eventos');
    }

    return this;
  }

  createRole() {
    this.user.role = this.role;

    if (this.role === 'artist') {
      this.createArtist();
      return this;
    }

    if (this.role === 'contractor') {
      this.createContractor();
      return this;
    }    

    throw new Error('Invalid role provided...');
  }

  createArtist() {
    this.roleInstance = new Artist();
    return this;
  }

  createContractor() {
    this.roleInstance = new Contractor();
    return this;
  }

  async searchArtistById(id) {
    this.user.role = 'artist';
    this.roleInstance = await Artist.findById(id).populate('users');
    return this;
  }

  async searchContractorById(id) {
    this.user.role = 'contractor';
    this.roleInstance = await Contractor.findById(id).populate('users');
    return this;
  }

  ensureArtistWasFound() {
    if (Artist.notFound(this.roleInstance) || !this.roleInstance instanceof Artist) {
      throw new BadRequestException('Artista não reconhecido');
    }

    console.log('Artist found...');
    return this;
  }

  ensureContractorWasFound() {
    if (Contractor.notFound(this.roleInstance) || !this.roleInstance instanceof Contractor) {
      throw new BadRequestException('Organizador de eventos não reconhecido');
    }

    console.log('Contractor found...');
    return this;
  }

  async saveRole() {
    await this.roleInstance.save();
    return this;
  }

  assignRoleToUser() {
    if (this.role === 'artist') {
      console.log('Assigning user as artist...');
      this.user.artist = this.roleInstance.id;
      return this;
    }

    if (this.role === 'contractor') {
      console.log('Assigning user as contractor...');
      this.user.contractor = this.roleInstance.id;
      return this;
    }

    throw new Error('No role assigned');
  }

  assignUserToRole() {
    if (this.roleInstance.users === undefined) { this.roleInstance.users = []; }
    this.roleInstance.users.push(this.user.id);

    // If there is no email assigned, make user's mail as role's main mail
    if (this.roleInstance.email === undefined) { this.roleInstance.email = this.user.email; }
    return this;
  }

  defaultRoleProfile() {
    if (this.role === 'artist') { return this; } // contractor only
    this.roleInstance.name = this.user.name;
    return this;
  }

  async generateShareUrls() {
    if (this.role !== 'artist') { return this; }
    
  }

  async generateFirstStepsNotifications() {
    if (this.user.role !== 'artist') { return this; }
    
    const from = await User.findOne({ email: 'admin@iauu.com.br' });
    await this.generateCompleteProfileNotification(from);
    await this.generateCreateProductNotification(from);
    return this;
  }

  async generateCompleteProfileNotification(adminUser) {

    this.emitEvent(EVENTS.ASK_USER_TO_COMPLETE_PROFILE_EVENT, {
      from: adminUser, 
      to: this.user, 
      message: 'Bem vindo a iauü! Para começar a receber propostas, complete seu perfil', 
      type: 'role', 
      target: this.user
    });

    return this;
  }

  async generateCreateProductNotification(adminUser) {
    this.emitEvent(EVENTS.ASK_USER_TO_CREATE_PRODUCT_EVENT, {
      from: adminUser, 
      to: this.user, 
      message: 'Inclua formatos de apresentação para ser encontrado', 
      type: 'product', 
      target: this.user
    });

    return this;
  }
}
