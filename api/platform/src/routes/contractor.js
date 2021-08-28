const api = require('express').Router();

const contractorController = require('../controller/contractor');
const { authorizationMiddleware, validationMiddleware } = require('@iauu/middlewares');

api.get('/:id', authorizationMiddleware.app, validationMiddleware.id, contractorController.searchContractor);
api.get('/:id/validate', authorizationMiddleware.app, validationMiddleware.id, contractorController.validateContractor);
api.get('/profile', authorizationMiddleware.authorize, authorizationMiddleware.contractor, contractorController.profile);
api.put('/profile', authorizationMiddleware.authorize, authorizationMiddleware.contractor, validationMiddleware.profile, contractorController.updateProfile);

module.exports = api;