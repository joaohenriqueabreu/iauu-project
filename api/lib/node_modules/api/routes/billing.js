const api = require('express').Router();

const billingController = require('../controller/billing');
const { authorizationMiddleware, validationMiddleware, dataMiddleware } = require('lib/middleware');

api.post('/', 
  authorizationMiddleware.app, 
  validationMiddleware.billing, 
  dataMiddleware.fetchPresentation, 
  dataMiddleware.fetchArtist, 
  dataMiddleware.fetchContractor, 
  billingController.createBilling
);

api.put('/:id/installments', authorizationMiddleware.authorize, authorizationMiddleware.contractor, billingController.updateInstallments);
api.put('/:id/pay', authorizationMiddleware.authorize, authorizationMiddleware.contractor, billingController.chargePayment);
api.post('/account', authorizationMiddleware.authorize, authorizationMiddleware.artist, validationMiddleware.bankAccount, billingController.saveBankAccount);

module.exports = api;