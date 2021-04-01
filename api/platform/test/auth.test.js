const moment = require('moment');
const sinon = require('sinon');
const should = require('chai').should();
const expect = require('chai').expect;

// Set env test
process.env.NODE_ENV = 'test';

const dbConnection = require('../src/data/db');
const db = require('mongoose');

// Exceptions
const BadRequestException = require('../src/exception/bad');
const UnauthorizedException = require('../src/exception/unauthorized');

// Models
const { User, Artist, Contractor } = require('../src/models');

// Services
const RegisterUserService = require('../src/services/auth/registerUser');
const LoginUserService = require('../src/services/auth/loginUser');
const VerifyUserService = require('../src/services/auth/verifyUser');
const ResetPasswordService = require('../src/services/auth/resetPassword');
// const FacebookLoginService = require('../src/services/auth/facebookLogin');
// const GoogleLoginService = require('../src/services/auth/googleLogin');
const AssignRoleService = require('../src/services/auth/assignRole');
const GenerateTokenService = require('../src/services/auth/generateToken');
const CreateNotificationService = require('../src/services/notification/createNotification');

const name = 'User Name';
const pwd = '123456';
const email = 'user@gmail.com';
const socialId = '123456789';

// Share user among tests
let user = {};

const shouldLog = true;
const generalMock = () => { console.log('you have been mocked'); }

let sandbox = sinon.createSandbox();

describe('Auth testing', function () {
  before(async function () {

    // Log level
    if (!shouldLog) { sandbox.stub(console, 'log'); }

    // Create Service stubs
    sandbox.stub(RegisterUserService.prototype, 'sendRegistrationMail').callsFake(generalMock);
    sandbox.stub(VerifyUserService.prototype, 'sendWelcomeMail').callsFake(generalMock);
    sandbox.stub(ResetPasswordService.prototype, 'sendPwdChangedMail').callsFake(generalMock);
    sandbox.stub(ResetPasswordService.prototype, 'sendForgotPasswordMail').callsFake(generalMock);
    sandbox.stub(CreateNotificationService.prototype, '');

    // Connect to db
    await dbConnection.connect();
  });
  
  after(async () => {
    // Remove stubs
    sandbox.restore();

    console.log('Exiting and cleanup...');
    await User.deleteMany({});
    await Artist.deleteMany({});
    await Contractor.deleteMany({});
    db.disconnect();
  });

  describe('User registration', function () {
    it('should save user', async function () {
      const registerUserSvc = new RegisterUserService(name, email, pwd);
      await registerUserSvc.register();
      user = registerUserSvc.getUser();
      user.should.be.instanceof(User);
      user.email.should.be.equal(email);
      user.name.should.be.equal(name);
      user.status.should.be.equal('pending');
      user.password.should.not.equal(pwd);
      
      user.verification.should.have.property('token');
      user.verification.should.have.property('is_verified');
      user.verification.should.have.property('issued_at');
      user.referral.should.have.property('token');
    });
  
    it('should save user with referrer', async function () {
      const registerUserSvc = new RegisterUserService('Referred user', 'referred@iauu.com.br', '654321');
      await registerUserSvc.register(user.referral.token);
  
      const referredUser = await User.findById(registerUserSvc.getUser().id)
        .select('+referral.from')
        .populate({ path: 'referral', populate: { path: 'from' }});
  
      referredUser.referral.from.should.be.instanceof(User);
      referredUser.referral.from.email.should.be.equal(email);
    });

    it('should fail when missing attribute', async function () {
      try {
        const registerUserSvc = new RegisterUserService(name, email);
        await registerUserSvc.register();
      } catch (error) {
        error.should.be.instanceof(Error);
      }
    });
  
    it('should fail if user exists', async function () {
      try {
        const registerUserSvc = new RegisterUserService(name, email, pwd);
        await registerUserSvc.register();
      } catch (error) {
        error.should.be.instanceof(BadRequestException);
      }
    });
  });
  
  describe('Verify email', () => {
    // Set user verification as pending
    beforeEach(async () => {
      user = await User.fetchWithSensitiveDataById(user.id);
  
      user.verification.is_verified = false;
      user.status = 'pending';
      await user.save();
    });
  
    it('should verify user', async () => {
      const verifyUserService = new VerifyUserService(user.verification.token);
      await verifyUserService.verify();
  
      const verifiedUser = verifyUserService.getUser();
      verifiedUser.access_token.should.exist;
      verifiedUser.status.should.equal('unassigned');
      verifiedUser.verification.is_verified.should.be.true;
    });
  
    it('should fail on invalid token', async () => {
      try {
        const verifyUserService = new VerifyUserService('this is an invalid token');
        await verifyUserService.verify();
      } catch (error) {
        error.should.be.instanceof(BadRequestException);
      }
    });
  
    it('should fail on expired token', async () => {
      try {
        user.verification.issued_at = moment().add('-2', 'days').toISOString();
        await user.save();
  
        const verifyUserService = new VerifyUserService(user.verification.token);
        await verifyUserService.verify();
      } catch (error) {
        error.should.be.instanceof(UnauthorizedException);
      }
    });
  
    it('should verify user when bypassing even with expired token', async () => {
      user.verification.issued_at = moment().add('-2', 'days').toISOString();
      await user.save();
  
      const verifyUserService = new VerifyUserService(user.verification.token, true);
      await verifyUserService.verify();

      const verifiedUser = verifyUserService.getUser();
      verifiedUser.access_token.should.exist;
      verifiedUser.status.should.equal('unassigned');
      verifiedUser.verification.is_verified.should.be.true;
    });
  });
  
  describe('Login user', () => {
    it('should login user with valid email and password', async () => {
      const loginUserSvc = new LoginUserService(email, pwd);
      await loginUserSvc.login();
  
      const loggedInUser = loginUserSvc.getUser();
      loggedInUser.should.be.instanceof(User);
    });
  
    it('should not login with invalid email', async () => {
      try {
        const loginUserSvc = new LoginUserService('other@email.com', pwd);
        await loginUserSvc.login();
      } catch (error) {
        error.should.be.instanceof(UnauthorizedException);
      }
    });
  
    it('should not login with invalid password', async () => {
      try {
        const loginUserSvc = new LoginUserService(email, 'invalid password');
        await loginUserSvc.login();
      } catch (error) {
        error.should.be.instanceof(UnauthorizedException);
      }
    });
  
    it('should not login unverified user', async () => {
      try {
        user = await User.fetchWithSensitiveDataById(user.id);
        user.verification.is_verified = false;
        user.status = 'pending';
        await user.save();
  
        const loginUserSvc = new LoginUserService(email, pwd);
        await loginUserSvc.login();
      } catch (error) {
        error.should.be.instanceof(UnauthorizedException);
      }
    });
  
  //   // TODO create social login tests
  //   // it('should login user with valid Facebook ID', async () => {
  //   //   user.social.facebook_id = socialId
  //   //   await user.save()
  
  //   //   const loginUserSvc = new FacebookLoginService('any token')
  //   //   await loginUserSvc.login()
  
  //   //   const loggedInUser = loginUserSvc.getUser()
  //   //   expect(loggedInUser).toBeInstanceOf(User)
  //   //   expect(loggedInUser.social.facebook_id).toEqual(socialId)
  //   // })
  
  //   // it('should create user with another Facebook ID', async () => {
  //   //   user.social.facebook_id = 'another-id'
  //   //   await user.save()
  
  //   //   const loginUserSvc = new FacebookLoginService('any token')
  //   //   await loginUserSvc.login()
  
  //   //   const loggedInUser = loginUserSvc.getUser()
  //   //   expect(loggedInUser).toBeInstanceOf(User)
  //   //   expect(loggedInUser.social.facebook_id).toEqual('another-id')
  //   // })
  
  //   // it('should login user with valid Google ID', async () => {
  //   //   user.social.google_id = socialId
  //   //   await user.save()
  
  //   //   const loginUserSvc = new GoogleLoginService('any token')
  //   //   await loginUserSvc.login()
  
  //   //   const loggedInUser = loginUserSvc.getUser()
  //   //   expect(loggedInUser).toBeInstanceOf(User)
  //   //   expect(loggedInUser.social.google_id).toEqual(socialId)
  //   // })
  
  //   // it('should create user with another Google ID', async () => {
  //   //   user.social.google_id = 'another-id'
  //   //   await user.save()
  
  //   //   const loginUserSvc = new GoogleLoginService('any token')
  //   //   await loginUserSvc.login()
  
  //   //   const loggedInUser = loginUserSvc.getUser()
  //   //   expect(loggedInUser).toBeInstanceOf(User)
  //   //   expect(loggedInUser.social.google_id).toEqual('another-id')
  //   // })
  });
  
  describe('Role assignment', () => {
    // Assume user verified for role assignment and unassign role
    beforeEach(async () => {
      user = await User.fetchWithSensitiveDataById(user.id);
      user.verification.is_verified = true;
      user.role = 'none';
      user.status = 'unassigned';
      user.artist = undefined;
      user.contrator = undefined;
      await user.save();
    });
  
    it('should create artist', async () => {
      const assigRoleSvc = new AssignRoleService({ id: user.id }, 'artist');
      await assigRoleSvc.assign();
  

      const artistUser = await User.findById(user.id).populate({ path: 'artist', populate: { path: 'users' }});
      artistUser.artist.should.be.instanceof(Artist);
      artistUser.status.should.be.equal('active');
      artistUser.artist.users[0].id.should.be.equal(user.id);
    });

    it('should save user with artist', async function () {
      const assigRoleSvc = new AssignRoleService({ id: user.id }, 'artist');
      await assigRoleSvc.assign();

      const assignedUser = assigRoleSvc.getUser();
      assignedUser.artist.should.be.instanceof(Artist);
      const registerUserSvc = new RegisterUserService('Artist user', 'artist@iauu.com.br', '654321');
      await registerUserSvc.register(null, GenerateTokenService.encryptId(assignedUser.artist.id));
  
      const artistUserId = registerUserSvc.getUser().id;
      const artistUser = await User.findById(artistUserId).populate('artist');
      artistUser.artist.should.be.instanceof(Artist);
      artistUser.verification.is_verified = false;
      artistUser.status.should.be.equal('assigned');
    });
  
    it('should create contractor', async () => {
      const assigRoleSvc = new AssignRoleService({ id: user.id }, 'contractor');
      await assigRoleSvc.assign();
  
      const contractorUser = await User.findById(user.id).populate('contractor');
      contractorUser.status.should.be.equal('active');
      contractorUser.contractor.should.be.instanceof(Contractor);
    });
  
    it('should not assign for active user', async () => {
      user.status = 'active';
      await user.save();
      const assigRoleSvc = new AssignRoleService({ id: user.id }, 'contractor');
      try {
        await assigRoleSvc.assign();
      } catch (error) {
        error.should.be.instanceof(BadRequestException);
      }
    });

    it('should not assign for invalid role', async () => {
      const assigRoleSvc = new AssignRoleService({ id: user.id }, 'contractor');
      try {
        await assigRoleSvc.assign();
      } catch (error) {
        error.should.be.instanceof(BadRequestException);
      }
    });
  });

  describe('Reset Password', () => {
    it('should renew verification token', async () => {
      const previousVerification = user.verification.token;
      const resetPwdSvc = new ResetPasswordService({ email });
      await resetPwdSvc.forgot();

      const verificationUser = resetPwdSvc.getUser();
      verificationUser.verification.token.should.not.equal(previousVerification);
    });

    it('should not send mail for invalid mail', async () => {
      const resetPwdSvc = new ResetPasswordService({ email: 'invalid@mail.com' });
      try {
        await resetPwdSvc.forgot();
      } catch (error) {
        error.should.be.instanceof(Error);
      }
    });

    it('should change password with valid token', async () => {
      user = await User.fetchWithSensitiveDataById(user.id);
      const currentPwd = user.password;
      const resetPwdSvc = new ResetPasswordService({ token: user.verification.token, password: '654321' });
      await resetPwdSvc.reset();

      const resetPwdUser = resetPwdSvc.getUser();
      resetPwdUser.password.should.not.equal(currentPwd);
    });

    it('should not allow password change with invalid token', async () => {
      user = await User.fetchWithSensitiveDataById(user.id);
      const resetPwdSvc = new ResetPasswordService({ token: 'an invalid token', password: '654321' });
      try {
        await resetPwdSvc.reset();
      } catch (error) {
        error.should.be.instanceof(Error);
      }
    });
  });
});