const api = require('express').Router();

const contractorController = require('../controller/contractor');
const { authorizationMiddleware, validationMiddleware } = require('../middleware');

api.get('/:id/validate', authorizationMiddleware.app, validationMiddleware.id, contractorController.validateContractor);
api.get('/:id/fetch', authorizationMiddleware.app, validationMiddleware.id, contractorController.fetchContractor);

api.get('/artists/search', validationMiddleware.search, contractorController.searchArtists);
api.get('/profile', authorizationMiddleware.authorize, authorizationMiddleware.contractor, contractorController.profile);
api.put('/profile', authorizationMiddleware.authorize, authorizationMiddleware.contractor, validationMiddleware.profile, contractorController.updateProfile);

module.exports = api;