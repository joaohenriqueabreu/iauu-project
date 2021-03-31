const api = require('express').Router();

const artistController = require('../controller/artist');
const { authorizationMiddleware, validationMiddleware, dataMiddleware }  = require('lib/middleware');

api.get('/:id/validate', authorizationMiddleware.app, validationMiddleware.id, artistController.validateArtist);
api.get('/:id/fetch', authorizationMiddleware.app, validationMiddleware.id, artistController.fetchArtist);

api.get('/:slug/public', validationMiddleware.slug, artistController.publicInfo);
api.get('/:id/private', validationMiddleware.id, authorizationMiddleware.authorize, artistController.privateInfo);

api.get('/profile', authorizationMiddleware.authorize, authorizationMiddleware.artist, artistController.profile);
api.put('/profile', authorizationMiddleware.authorize, authorizationMiddleware.artist, validationMiddleware.profile, artistController.updateProfile);

api.get('/products', authorizationMiddleware.authorize, authorizationMiddleware.artist, artistController.products);
api.get('/:id/products', validationMiddleware.id, authorizationMiddleware.authorize, artistController.products);
api.post('/products', validationMiddleware.product, authorizationMiddleware.authorize, authorizationMiddleware.artist, artistController.saveProduct);
api.delete('/products/:id', validationMiddleware.id, authorizationMiddleware.authorize, authorizationMiddleware.artist, artistController.deleteProduct);

module.exports = api;