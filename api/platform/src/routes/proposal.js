const api = require('express').Router();

const proposalController = require('../controller/proposal');
const { authorizationMiddleware, validationMiddleware } = require('lib/middleware');

// Apps endpoints
api.get('/',                authorizationMiddleware.authorize,  proposalController.searchUserProposals);
api.get('/role/:id',        authorizationMiddleware.app,        validationMiddleware.id,            proposalController.searchRoleProposals);
api.get('/:id',             authorizationMiddleware.app,        validationMiddleware.id,            proposalController.searchProposal);
api.put('/:id',             authorizationMiddleware.app,        validationMiddleware.id,            validationMiddleware.proposal,  proposalController.editProposal);
api.post('/',               authorizationMiddleware.authorize,  authorizationMiddleware.contractor, validationMiddleware.proposal,  proposalController.sendProposal);
api.delete('/:id',          authorizationMiddleware.authorize,  validationMiddleware.id,            proposalController.rejectProposal);
api.put('/:id/timeslot',    authorizationMiddleware.authorize,  validationMiddleware.id,            validationMiddleware.timeslot,  proposalController.selectTimeslot);
api.put('/:id/accept',      authorizationMiddleware.authorize,  authorizationMiddleware.artist,     validationMiddleware.id,        proposalController.acceptProposal);

// Counter offer logic
api.post('/:id/counterOffer',    authorizationMiddleware.authorize, authorizationMiddleware.artist,     validationMiddleware.id, validationMiddleware.counterOffer, proposalController.sendCounterOffer);
api.put('/:id/counterOffer',     authorizationMiddleware.authorize, authorizationMiddleware.contractor, validationMiddleware.id, proposalController.acceptCounterOffer);
api.delete('/:id/counterOffer',  authorizationMiddleware.authorize, authorizationMiddleware.contractor, validationMiddleware.id, proposalController.rejectCounterOffer);

module.exports = api;