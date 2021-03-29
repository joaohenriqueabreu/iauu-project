const api = require('express').Router();

const feedbackController = require('../controller/feedback');
const { authorizationMiddleware, validationMiddleware, dataMiddleware } = require('../middleware');

api.get('/presentation/:id', authorizationMiddleware.authorize, validationMiddleware.id, dataMiddleware.validatePresentation, feedbackController.presentationFeedback);
api.get('/artist/:id', validationMiddleware.id, feedbackController.artistFeedbacks);

api.post('/', authorizationMiddleware.authorize, authorizationMiddleware.contractor, validationMiddleware.feedback, feedbackController.saveFeedback);

module.exports = api;