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

  ensureUserIsNotYetAssigned() {
    if (this.user.status !== 'unassigned') {
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

  async saveRole() {
    this.roleInstance.user = this.user.id
    await this.roleInstance.save()
    return this
  }

  assignUserRole() {
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

  activateUser() {
    this.user.status = 'active'
    return this
  }
}
