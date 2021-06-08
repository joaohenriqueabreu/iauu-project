const api = require('express').Router();

const billingController = require('../controller/billing');
const { authorizationMiddleware, validationMiddleware } = require('iauu/middleware');

api.get('/account',         authorizationMiddleware.authorize, authorizationMiddleware.artist,      billingController.searchArtistAccount);
api.put('/:id/instalments', authorizationMiddleware.authorize, authorizationMiddleware.artist,      validationMiddleware.id,          validationMiddleware.instalments, billingController.updateInstalments);
api.put('/:id/pay',         authorizationMiddleware.authorize, authorizationMiddleware.contractor,  validationMiddleware.id,          validationMiddleware.payment,     billingController.chargePayment);
api.post('/account',        authorizationMiddleware.authorize, authorizationMiddleware.artist,      validationMiddleware.bankAccount, billingController.saveBankAccount);

api.get('/presentation/:id', authorizationMiddleware.authorize, validationMiddleware.id, billingController.searchPresentationBilling);

module.exports = api;