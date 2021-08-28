const { ScriptService }     = require('@iauu/services');
const { User }              = require('../../models');
const bcrypt                = require('bcryptjs');
const GenerateTokenService  = require('./generateToken');
const context               = require('mongoose');

module.exports = class RegisterSuperAdminUserScriptService extends ScriptService {
  constructor(name, email, password) {
    super(context);
    
    if (!name || !email || !password) {
      throw new Error('Invalid user info...');
    }

    this.user       = new User();
    this.user.email = email;
    this.user.name  = name;
    this.password   = password;
  }

  async internalRunScript() {
    await this.checkUserExists();
    await this.encryptPassword(this.password);
    this.populateAdminInfo();
    await this.generateAccessToken();
    this.generateAdminToken();
    await this.saveUser(); 

    console.log('Registered admin user...');
    return this;
  }

  async checkUserExists() {
    const exists = await User.exists({ email: this.user.email })    
    if (exists) {
      throw new Error('User exists...');
    }

    return this;
  }

  async encryptPassword(password) {
    const hash = await bcrypt.hashSync(password, 2);
    this.user.password = hash;
  }


  populateAdminInfo() {
    this.user.role = 'admin';
    this.user.verification.is_verified = true;
    return this;
  }

  async generateAccessToken() {
    this.user.access_token = await GenerateTokenService.generateForUser(this.user);
    return this;
  }

  generateAdminToken() {
    this.user.admin_token = GenerateTokenService.generateSimple();
    return this;
  }

  async saveUser() {
    console.log('Trying to save user...');
    if (this.user.isModified) {
      await this.user.save();
      console.log('User updated...');
    }

    return this;
  }
}