const AuthService   = require('./auth');
const User          = require('../../models/user');
const UnauthorizedException = require('../../exception/unauthorized');
const GenerateTokenService = require('./generateToken');

module.exports = class AuthenticateUserService extends AuthService
{
    constructor(email, password) {
      super();
      this.email = email;
      this.password = password;
    }

    async login() {
      await this.lookupUser({ email: this.email })
      await this.validateLogin();
      await this.generateAccessToken();
      this.generateAdminToken().renewLastLogin();
      await this.saveUser();
      return this;
    }

    async searchUser() {
      this.user = await User.findById(this.id).populate('artist').populate('contractor');
      return this;
    }

    async validateLogin() {
      if (User.notFound(this.user)) {
        throw new UnauthorizedException('Email ou senha inválidos');
      }

      if (! await this.validatePassword(this.password)) {
        throw new UnauthorizedException('Email ou senha inválidos');
      }

      if (! this.user.verification.is_verified) {
        throw new UnauthorizedException('Conta ainda não foi verificada. Acesse seu email e acesse o link de verificação enviado.');
      }

      return this;
    }

    async validateNonPasswordLogin() {
      if (User.notFound(this.user)) {
        throw new UnauthorizedException('Invalid credentials provided');
      }

      if (! this.user.verification.is_verified) {
        throw new UnauthorizedException('User not verified');
      }

      return this;
    }

    generateAdminToken() {
      if (this.user.role.includes('admin')) {
        console.log('Admin user, creating new token...');
        this.user.admin_token = GenerateTokenService.generateSimple();
      }

      return this;
    }

    renewLastLogin() {
      console.log('Updating last login...');
      this.user.last_logged_in = Date.now();
      return this;
    }
}
