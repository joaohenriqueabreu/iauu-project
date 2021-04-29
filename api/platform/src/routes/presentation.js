const api = require('express').Router();

const presentationController = require('../controller/presentation');
const { authorizationMiddleware, validationMiddleware, dataMiddleware } = require('lib/middleware');

// Apps endpoints
api.get('/role/:id',            authorizationMiddleware.app,        validationMiddleware.id, validationMiddleware.query, presentationController.searchRolePresentations);
api.get('/types',               presentationController.getTypes);
api.get('/',                    authorizationMiddleware.authorize,  presentationController.searchUserPresentations);
api.get('/:id',                 authorizationMiddleware.authorize,  validationMiddleware.id,        presentationController.search);
api.put('/:id/complete',        authorizationMiddleware.authorize,  validationMiddleware.id,        presentationController.completePresentation);
api.delete('/:id',              authorizationMiddleware.authorize,  validationMiddleware.id,        presentationController.cancelPresentation);

api.put('/:id',                 authorizationMiddleware.authorize,  authorizationMiddleware.contractor, validationMiddleware.id, validationMiddleware.body, presentationController.editPresentation);
api.post('/:id/status/:status', authorizationMiddleware.app,        validationMiddleware.id,            validationMiddleware.status, presentationController.updatePresentationStatus);

module.exports = api;