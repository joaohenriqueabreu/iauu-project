const api = require('express').Router();

const statisticsController = require('../controller/statistics');
const { authorizationMiddleware, validationMiddleware } = require('@iauu/middlewares');

api.post('/visit', validationMiddleware.body, statisticsController.visitEvent);

module.exports = api;