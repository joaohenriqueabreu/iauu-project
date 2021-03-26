const api = require("express").Router();

const feedbackController = require("../controller/feedback");
const authorizationMiddleware = require("../middleware/authorization");
const validationMiddleware = require("../middleware/validation");

api.get('/presentation/:id', authorizationMiddleware.authorize, validationMiddleware.id, feedbackController.presentationFeedback);
api.get('/artist/:id', validationMiddleware.id, feedbackController.artistFeedbacks);

api.post('/', authorizationMiddleware.authorize, validationMiddleware.feedback, feedbackController.saveFeedback);

module.exports = api;