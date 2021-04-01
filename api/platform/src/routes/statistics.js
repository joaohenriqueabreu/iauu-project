const api = require('express').Router();

const statisticsController = require('../controller/statistics');
const { authorizationMiddleware, validationMiddleware } = require('lib/middleware');

api.post('/visit', validationMiddleware.body, statisticsController.visitEvent);

module.exports = api;