const api = require('express').Router();
const authController = require('../controller/auth');
const adminController = require('../controller/admin');
const { validationMiddleware, authorizationMiddleware } = require('@iauu/middlewares');

api.post('/login',          validationMiddleware.credentials,       authController.login);
api.post('/loginAs',        validationMiddleware.adminCredentials,  adminController.loginAsUser);
api.post('/login/facebook', validationMiddleware.social,            authController.facebookLogin);
api.post('/login/google',   validationMiddleware.social,            authController.googleLogin);
api.post('/login/social',   validationMiddleware.social2,           authController.socialLogin);
api.post('/verify',         validationMiddleware.verify,            authController.verify);
api.post('/verify/resend',  validationMiddleware.verify,            authController.resendVerification);
api.post('/role',           authorizationMiddleware.authorize,      validationMiddleware.role, authController.assignRole);
api.post('/validate',       authorizationMiddleware.authorize,      authController.validate);
api.delete('/login',        authController.logoff);

api.post('/register', validationMiddleware.newCrendentials, authController.register);
api.post('/reset/forgot', validationMiddleware.forgotPassword, authController.forgotPassword);
api.post('/reset/authorize', validationMiddleware.verify, authController.authorizeFromVerification);
api.post('/reset/password', validationMiddleware.verify, validationMiddleware.resetPassword, authController.resetPassword);

api.get('/users/profile', authorizationMiddleware.authorize, authController.userProfile);
api.put('/users/profile', authorizationMiddleware.authorize, validationMiddleware.profile, authController.updateProfile);

api.get('/users/renew', authorizationMiddleware.authorize, authController.renewAuth);
api.get('/users/exchange', authorizationMiddleware.authorize, authController.encryptRoleId);

// TODO implement delete logic (facebook required for GDPR compliance)
api.get('/login/delete', authController.logoff);

module.exports = api;
