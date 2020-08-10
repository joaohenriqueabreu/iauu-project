const AuthService = require('./auth')
const { Artist, Contractor } = require('../../models')
const BadRequestException = require('../../exception/bad')

module.exports = class AssignRoleService extends AuthService {
  constructor(data, role) {
    super()
    
    this.id = data.id
    this.role = role
    this.roleInstance = {}
  }

  async assign() {
    await this.searchUserById(this.id)
    this.ensureUserWasFound()
      .ensureUserIsNotYetAssigned()
      .createRole()
    await this.saveRole()
    this.assignUserRole()
    this.activateUser()
    await this.saveUser()
    await this.searchUserById(this.user.id) // Refresh user to prevent populate buffer issues
    await this.generateAccessToken()
    return this
  }

  async linkArtist(artist) {
    console.log('Linking artist to user...')
    await this.searchUserById(this.id)
    this.ensureUserWasFound()
      .ensureUserIsNotYetAssigned()
    await this.searchArtistById(artist)
    this.ensureArtistWasFound()
      .assignUserRole()
    await this.saveRole()
    await this.saveUser()
    await this.searchUserById(this.user.id) // Refresh user to prevent populate buffer issues
    await this.generateAccessToken()
    return this
  }

  ensureUserIsNotYetAssigned() {
    if (!['unassigned', 'pending'].includes(this.user.status)) {
      throw new BadRequestException('User already assigned')
    }

    return this
  }

  createRole() {
    this.user.role = this.role

    if (this.role === 'artist') {
      this.createArtist()
      return this
    }

    if (this.role === 'contractor') {
      this.createContractor()
      return this
    }    

    throw new Error('Invalid role provided...')
  }

  createArtist() {
    this.roleInstance = new Artist()
    return this
  }

  createContractor() {
    this.roleInstance = new Contractor()
    return this
  }

  async searchArtistById(id) {
    this.user.role = 'artist'
    this.roleInstance = await Artist.findById(id)
    return this
  }

  ensureArtistWasFound() {
    if (Artist.notFound(this.roleInstance) || !this.roleInstance instanceof Artist) {
      throw new BadRequestException('Artista não reconhecido')
    }

    console.log('Artist found...')

    return this
  }

  async saveRole() {
    this.roleInstance.users.push(this.user.id)
    await this.roleInstance.save()
    return this
  }

  assignUserRole() {
    this.user.status = 'assigned'
    if (this.role === 'artist') {
      console.log('Assigning user as artist...')
      this.user.artist = this.roleInstance.id
      return this
    }

    if (this.role === 'contractor') {
      console.log('Assigning user as contractor...')
      this.user.contractor = this.roleInstance.id
      return this
    }

    throw new Error('No role assigned')
  }
}
