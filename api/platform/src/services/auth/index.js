// @index('./*.js', (f, _) => `const ${_.pascalCase(f.name)}Service = require('${f.path}');`)
const AssignRoleService = require('./assignRole');
const AuthService = require('./auth');
const FacebookLoginService = require('./facebookLogin');
const GenerateTokenService = require('./generateToken');
const GoogleLoginService = require('./googleLogin');
const LoginAsUserService = require('./loginAsUser');
const LoginUserService = require('./loginUser');
const RegisterAdminUserService = require('./registerAdminUser');
const RegisterUserService = require('./registerUser');
const RenewAuthService = require('./renewAuth');
const ResetPasswordService = require('./resetPassword');
const SaveProfileService = require('./saveProfile');
const SocialLoginService = require('./socialLogin');
const UserProfileService = require('./userProfile');
const ValidateUserService = require('./validateUser');
const VerifyUserService = require('./verifyUser');
// @endindex

module.exports = {
  // @index('./*.js', (f, _) => `${_.pascalCase(f.name)}Service,`)
  AssignRoleService,
  AuthService,
  FacebookLoginService,
  GenerateTokenService,
  GoogleLoginService,
  LoginAsUserService,
  LoginUserService,
  RegisterAdminUserService,
  RegisterUserService,
  RenewAuthService,
  ResetPasswordService,
  SaveProfileService,
  SocialLoginService,
  UserProfileService,
  ValidateUserService,
  VerifyUserService,
  // @endindex
}