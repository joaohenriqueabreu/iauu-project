const api = require('express').Router();

const scheduleController = require('../controller/schedule');
const { authorizationMiddleware, validationMiddleware } = require('lib/middleware');

api.get('/public/:id',  validationMiddleware.schedule,      validationMiddleware.query,     scheduleController.publicSearch);
api.get('/my',          authorizationMiddleware.authorize,  validationMiddleware.query,     scheduleController.userSchedule);

api.post('/',           authorizationMiddleware.authorize,  validationMiddleware.timeslot,  scheduleController.saveTimeslot);
api.delete('/:id',      authorizationMiddleware.authorize,  validationMiddleware.id,        scheduleController.deleteTimeslot);

module.exports = api;