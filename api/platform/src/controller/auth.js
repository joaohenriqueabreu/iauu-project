'use strict';

const BaseController          = require('./base');
const RegisterUserService     = require('../services/auth/registerUser');
const LoginUserService        = require('../services/auth/loginUser');
const ValidateUserService     = require('../services/auth/validateUser');
const VerifyUserService       = require('../services/auth/verifyUser');
const ResetPasswordService    = require('../services/auth/resetPassword');
const FacebookLoginService    = require('../services/auth/facebookLogin');
const GoogleLoginService      = require('../services/auth/googleLogin');
const AssignRoleService       = require('../services/auth/assignRole');
const RenewAuthService        = require('../services/auth/renewAuth');
const UserProfileService      = require('../services/auth/userProfile');
const GenerateTokenService    = require('../services/auth/generateToken');
const SaveUserProfileService  = require('../services/auth/saveProfile');

class AuthController extends BaseController {
  async register(req, res, next) {
    const { name, email, password, referral_token, artist_token } = req.data;

    const registerUserSvc = new RegisterUserService(name, email, password);
    try {
      await registerUserSvc.register(referral_token, artist_token);
      res.status(200).json({ message: 'Successfully registered. Please verify account' });
    } catch (error) {
      next(error);
    }
  }

  async verify(req, res, next) {
    const verifyUserService = new VerifyUserService();

    try {
      await verifyUserService.verify(req.data.token);
      res.status(200).send({}); // No need to send anything, user MUST attempt login after verify
    } catch (error) {
      next(error);
    }
  }

  resendVerification(req, res, next) {
    const { token } = req.data;
    const verifyUserService = new VerifyUserService(token);

    verifyUserService.resend()
      .then(() => res.status(200).send({}))
      .catch((error) => next(error));
  }

  async login(req, res, next) {
    console.log('Login user in...');
    const { email, password } = req.data;
    const loginUserService = new LoginUserService();

    try {
      await loginUserService.login(email, password);
      res.status(200).json(loginUserService.getToken());
    } catch (error) {
      next(error);
    }
  }

  socialLogin(req, res, next) {
    if (req.data.provider === 'google') {
      return this.googleLogin(req, res, next);
    }
  }

  facebookLogin(req, res, next) {
    console.log('Facebook Login...');
    const { token } = req.data;
    const facebookLoginService = new FacebookLoginService(token);

    facebookLoginService.login()
        .then(() => res.status(200).json(facebookLoginService.user.access_token))
        .catch((error) => next(error));
  }

  googleLogin(req, res, next) {
    console.log('Google Login...');
    const { token } = req.data;
    const googleLoginService = new GoogleLoginService(token);

    googleLoginService.login()
        .then(() => res.status(200).json(googleLoginService.getToken()))
        .catch((error) => next(error));
  }

  assignRole(req, res, next) {
    console.log('Assigning user role...');
    const { role } = req.data;
    const assignRoleService = new AssignRoleService(req.user, role);

    assignRoleService.assign()
      .then(() => res.status(200).json(assignRoleService.getToken()))
      .catch((error) => next(error));
  }

  authorizeFromVerification(req, res, next) {
    const { token } = req.data;
    const verifyUserService = new VerifyUserService(token);

    verifyUserService.authorize()
      .then(() => res.status(200).send({ message: 'Authorized from verification token' }))
      .catch((error) => next(error));
  }

  forgotPassword(req, res, next) {
    const { email } = req.data;
    const resetPasswordService = new ResetPasswordService({ email });
    resetPasswordService.forgot()
      .then(() => res.status(200).json({ message: 'Successfully generated reset password token' }))
      .catch((error) => next(error));
  }

  resetPassword(req, res, next) {
    const { token, password } = req.data;
    const resetPasswordService = new ResetPasswordService({ token, password });

    resetPasswordService.reset()
      .then(() => { res.status(200).json({ message: 'Successfully generated reset password token' }) })
      .catch((error) => next(error));
  }

  validate(req, res, next) {
    console.log('Request authorized...');
    console.log('Searching user...');

    const validateUserService = new ValidateUserService(req.user.id);

    validateUserService.refresh()
      .then(() => res.status(200).json(validateUserService.getUserPayload()))
      .catch((error) => next(error));
  }

  userProfile(req, res, next) {
    const userProfileSvc = new UserProfileService(req.user);

    userProfileSvc.search()
      .then(() => { res.status(200).json(userProfileSvc.getUser()) })
      .catch((error) => next(error));
  }

  updateProfile(req, res, next) {
    const saveUserProfileSvc = new SaveUserProfileService(req.user, req.data);

    saveUserProfileSvc.save()
      .then(() => { res.status(200).json(saveUserProfileSvc.getUser()) })
      .catch((error) => next(error));
  }

  renewAuth(req, res, next) {
    const renewAuthService = new RenewAuthService(req.user);

    renewAuthService.renew()
      .then(() => { res.status(200).json(renewAuthService.getUser()) })
      .catch((error) => next(error));
  }

  encryptRoleId(req, res, next) {
    if (req.user.role_id === undefined) {
      next(new Error('User not assigned'));
    }

    const encryptedId = GenerateTokenService.encryptId(req.user.role_id);
    res.status(200).json(encryptedId);
  }

  logoff(req, res) {
    res.status(200).json({});
  }
}

module.exports = new AuthController();
