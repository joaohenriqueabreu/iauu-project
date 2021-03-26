const api = require('express').Router()

const statisticsController = require('../controller/statistics')
const authorizationMiddleware = require('../middleware/authorization')
const validationMiddleware = require('../middleware/validation')

api.post('/visit', validationMiddleware.body, statisticsController.visitEvent)

module.exports = api