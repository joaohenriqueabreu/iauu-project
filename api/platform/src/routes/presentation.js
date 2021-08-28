const api = require('express').Router();

const presentationController = require('../controller/presentation');
const { authorizationMiddleware, validationMiddleware, dataMiddleware } = require('@iauu/middlewares');

// Apps endpoints
api.get('/role/:id',              authorizationMiddleware.app,        validationMiddleware.id, validationMiddleware.query, presentationController.searchRolePresentations);
api.get('/types',                 presentationController.getTypes);
api.get('/',                      authorizationMiddleware.authorize,  validationMiddleware.query,   presentationController.searchUserPresentations);
api.get('/:id',                   authorizationMiddleware.authorize,  validationMiddleware.id,      presentationController.search);
api.put('/:id/complete',          authorizationMiddleware.authorize,  validationMiddleware.id,      presentationController.completePresentation);
api.delete('/:id',                authorizationMiddleware.authorize,  validationMiddleware.id,      presentationController.cancelPresentation);
api.post('/:id/document',         authorizationMiddleware.authorize,  validationMiddleware.id,      validationMiddleware.file,  presentationController.uploadDocument);

api.put('/:id/document',          authorizationMiddleware.authorize,  validationMiddleware.id,      validationMiddleware.document,  presentationController.editDocument);
api.put('/:id/document/approve',  authorizationMiddleware.authorize,  validationMiddleware.id,      validationMiddleware.document,  presentationController.approveDocument);
api.put('/:id/document/reject',   authorizationMiddleware.authorize,  validationMiddleware.id,      validationMiddleware.document,  presentationController.rejectDocument);
api.delete('/:id/document',       authorizationMiddleware.authorize,  validationMiddleware.id,      validationMiddleware.document,  presentationController.deleteDocument);

api.put('/:id',                   authorizationMiddleware.authorize,  authorizationMiddleware.contractor, validationMiddleware.id, validationMiddleware.body, presentationController.editPresentation);
api.post('/:id/status/:status',   authorizationMiddleware.app,        validationMiddleware.id,            validationMiddleware.status, presentationController.updatePresentationStatus);

module.exports = api;