const api = require('express').Router();

const presentationController = require('../controller/presentation');
const { authorizationMiddleware, validationMiddleware, dataMiddleware } = require('../middleware');

// Apps endpoints
api.get('/:id/validate', authorizationMiddleware.app, validationMiddleware.id, presentationController.validatePresentation);
api.get('/:id/fetch', authorizationMiddleware.app, validationMiddleware.id, presentationController.search);

api.get('/types', presentationController.getTypes);
api.get('/', authorizationMiddleware.authorize, presentationController.searchPresentations);
api.get('/proposals', authorizationMiddleware.authorize, presentationController.searchProposals);

api.post('/proposal', 
  authorizationMiddleware.authorize,
  authorizationMiddleware.contractor,
  validationMiddleware.proposal,
  presentationController.sendProposal
);

api.get('/:id', authorizationMiddleware.authorize, validationMiddleware.id, presentationController.search);
api.put('/:id', authorizationMiddleware.authorize, validationMiddleware.id, presentationController.completePresentation);
api.delete('/:id', authorizationMiddleware.authorize, validationMiddleware.id, presentationController.cancelPresentation);

api.put('/:id/timeslot', authorizationMiddleware.authorize, validationMiddleware.id, validationMiddleware.timeslot, presentationController.selectTimeslot);

api.post('/:id/proposal', authorizationMiddleware.authorize, authorizationMiddleware.artist, validationMiddleware.id, presentationController.acceptProposal);
api.delete('/:id/proposal', authorizationMiddleware.authorize, validationMiddleware.id, presentationController.rejectProposal);

api.post('/:id/proposal/counterOffer', 
  authorizationMiddleware.authorize, 
  authorizationMiddleware.artist, 
  validationMiddleware.id, 
  validationMiddleware.counterOffer, 
  presentationController.sendCounterOffer
);

api.put('/:id/proposal/counterOffer', 
  authorizationMiddleware.authorize, 
  authorizationMiddleware.contractor, 
  validationMiddleware.id, 
  presentationController.acceptCounterOffer
);

api.delete('/:id/proposal/counterOffer', 
  authorizationMiddleware.authorize,  
  authorizationMiddleware.contractor, 
  validationMiddleware.id, 
  presentationController.rejectCounterOffer
);

module.exports = api;