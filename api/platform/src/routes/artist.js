const api = require('express').Router();

const artistController = require('../controller/artist');
const { authorizationMiddleware, validationMiddleware }  = require('iauu/middleware');

api.get('/',              validationMiddleware.search,  artistController.searchArtists);
api.get('/search',        validationMiddleware.search,  artistController.searchArtists);
api.get('/:id/private',   validationMiddleware.id,      authorizationMiddleware.authorize, artistController.privateInfo);
api.get('/:slug/public',  validationMiddleware.slug,    artistController.publicInfo);

// This should come first otherwise get /:id will override
api.get('/profile', authorizationMiddleware.authorize, authorizationMiddleware.artist, artistController.profile);
api.put('/profile', authorizationMiddleware.authorize, authorizationMiddleware.artist, validationMiddleware.profile, artistController.updateProfile);

api.get('/products',        authorizationMiddleware.authorize,  authorizationMiddleware.artist,     artistController.products);
api.get('/:id/products',    validationMiddleware.id,            authorizationMiddleware.authorize,  authorizationMiddleware.contractor, artistController.productsForProposal);
api.post('/products',       validationMiddleware.product,       authorizationMiddleware.authorize,  authorizationMiddleware.artist,     artistController.saveProduct);
api.delete('/products/:id', validationMiddleware.id,            authorizationMiddleware.authorize,  authorizationMiddleware.artist,     artistController.deleteProduct);

api.get('/:id',           authorizationMiddleware.app, validationMiddleware.id, artistController.searchArtist);
api.get('/:id/validate',  authorizationMiddleware.app, validationMiddleware.id, artistController.validateArtist);

module.exports = api;