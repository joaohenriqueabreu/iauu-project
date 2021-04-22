const BaseFactory           = require('./base');
const GenerateTokenService  = require('../../src/services/auth/generateToken');

module.exports = class AuthUserFactory extends BaseFactory {
  static manufacture(user, role) {
    return {
      id:                       user.id,
      role:                     [user.role], // Role must be an array for frontend $auth handle access scope
      email:                    user.email,
      name:                     user.name,
      photo:                    user.photo,
      role_id:                  role.id,
      admin_token:              user.admin_token,
      referral_token:           user.referral.token,
      requires_initial_setup:   false,
    }
  }
}