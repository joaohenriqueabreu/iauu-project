'use strict'

const BaseController = require('./base')
const SaveVisitEventService = require('../services/statistics/saveVisitEvent')

class StatisticsController extends BaseController {
  visitEvent(req, res, next) {
    console.log('Saving guest visit...')
    const saveVisitEventSvc = new SaveVisitEventService(req.data)
    saveVisitEventSvc.save()
      .then(() => { res.status(200).json({}) })
      .catch((error) => next(error))
  }
}

module.exports = new StatisticsController()
