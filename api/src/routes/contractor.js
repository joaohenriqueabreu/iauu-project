const api = require('express').Router();

const contractorController = require('../controller/contractor');
const authorizationMiddleware = require('../middleware/authorization');
const validationMiddleware = require('../middleware/validation');

api.get('/artists/search', validationMiddleware.search, contractorController.searchArtists);
api.get('/profile', authorizationMiddleware.authorize, authorizationMiddleware.contractor, contractorController.profile);
api.put('/profile', authorizationMiddleware.authorize, authorizationMiddleware.contractor, validationMiddleware.profile, contractorController.updateProfile);

module.exports = api;