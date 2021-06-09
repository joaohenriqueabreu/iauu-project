const api = require('express').Router();

const proposalController = require('../controller/proposal');
const { authorizationMiddleware, validationMiddleware } = require('iauu/middleware');

// Apps endpoints
api.get('/',                authorizationMiddleware.authorize,  proposalController.searchUserProposals);
api.get('/role/:id',        authorizationMiddleware.app,        validationMiddleware.id,            validationMiddleware.query,     proposalController.searchRoleProposals);
api.post('/',               authorizationMiddleware.authorize,  authorizationMiddleware.contractor, validationMiddleware.proposal,  proposalController.sendProposal);
// api.put('/:id/read',        authorizationMiddleware.authorize,  authorizationMiddleware.artist,     validationMiddleware.id,        proposalController.markProposalRead);
api.delete('/:id',          authorizationMiddleware.authorize,  validationMiddleware.id,            proposalController.rejectProposal);
api.put('/:id/timeslot',    authorizationMiddleware.authorize,  validationMiddleware.id,            validationMiddleware.timeslot,  proposalController.selectTimeslot);
api.put('/:id/accept',      authorizationMiddleware.authorize,  authorizationMiddleware.artist,     validationMiddleware.id,        proposalController.acceptProposal);

// Counter offer logic
api.post('/:id/counterOffer',    authorizationMiddleware.authorize, authorizationMiddleware.artist,     validationMiddleware.id, validationMiddleware.counterOffer, proposalController.sendCounterOffer);
api.put('/:id/counterOffer',     authorizationMiddleware.authorize, authorizationMiddleware.contractor, validationMiddleware.id, proposalController.acceptCounterOffer);
api.delete('/:id/counterOffer',  authorizationMiddleware.authorize, authorizationMiddleware.contractor, validationMiddleware.id, proposalController.rejectCounterOffer);

api.get('/:id',             authorizationMiddleware.app,        validationMiddleware.id,            proposalController.searchProposal);
api.put('/:id',             authorizationMiddleware.authorize,  validationMiddleware.id,            validationMiddleware.body,  proposalController.editProposal);

module.exports = api;