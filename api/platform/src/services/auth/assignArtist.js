const AssignRoleService       = require('./assignRole');
const { Artist }              = require('../../models');
const { BadRequestException } = require('iauu/exception');


module.exports = class AssignArtistRoleService extends AssignRoleService
{
  constructor() {
    super();

    this.role = 'artist';
  }

  async link(artist_id) {
    console.log('Linking artist to user...');
    await this.searchUserById(this.id);
    this.ensureUserWasFound()
      .ensureUserIsNotYetAssigned();
    await this.searchArtistById(artist_id);
    this.ensureArtistWasFound()
      .assignUserToRole()
      .assignRoleToUser()
      .copyReferralSource()
      .updateUserStatus();
    await this.generateShareUrls();
    await this.saveRole();
    await this.saveUser();
    await this.searchUserById(this.user.id);
    await this.generateAccessToken();
    return this;
  }

  createRole() {
    this.roleInstance = new Artist();
    return this;
  }

  async searchArtistById(id) {
    this.user.role = 'artist';
    this.roleInstance = await Artist.findById(id).populate('users');
    return this;
  }

  ensureArtistWasFound() {
    if (Artist.notFound(this.roleInstance) || !this.roleInstance instanceof Artist) {
      throw new BadRequestException('Artista não reconhecido');
    }

    console.log('Artist found...');
    return this;
  }

  assignRoleToUser() {
    console.log('Assigning user as artist...');
    this.user.artist = this.roleInstance.id;
    return this;    
  }

  // TODO switch to more abstract event emit
  // async generateFirstStepsNotifications() {    
  //   const from = await User.findOne({ email: 'admin@iauu.com.br' });
  //   await this.generateCompleteProfileNotification(from);
  //   await this.generateCreateProductNotification(from);
  //   return this;
  // }

  // async generateCompleteProfileNotification(adminUser) {
  //   this.emitEvent(EVENTS.ASK_USER_TO_COMPLETE_PROFILE_EVENT, {
  //     from:     adminUser, 
  //     to:       this.user, 
  //     message:  'Bem vindo a iauü! Para começar a receber propostas, complete seu perfil', 
  //     type:     'role', 
  //     target:   this.user
  //   });

  //   return this;
  // }

  // async generateCreateProductNotification(adminUser) {
  //   this.emitEvent(EVENTS.ASK_USER_TO_CREATE_PRODUCT_EVENT, {
  //     from:     adminUser, 
  //     to:       this.user, 
  //     message:  'Inclua formatos de apresentação para ser encontrado', 
  //     type:     'product', 
  //     target:   this.user
  //   });

  //   return this;
  // }
}