const BaseController = require('./base');
const SaveVisitEventService = require('../services/statistics/saveVisitEvent');
const CalculateArtistStatisticsService = require('../services/statistics/calculateArtistStatistics');

class StatisticsController extends BaseController {
  async visitEvent(req, res, next) {
    console.log('Saving guest visit...');
    const saveVisitEventSvc = new SaveVisitEventService(req.data);
    try {
      await saveVisitEventSvc.save();
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  }

  async calculateArtistStatistics(req, res, next) {
    console.log('Calculating artist statistics...');
    const calculateStatisticSvc = new CalculateArtistStatisticsService(req.user, req.data);
    try {
      await calculateStatisticSvc.calculate();
      res.status(200).json(calculateStatisticSvc.getStatistics());
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new StatisticsController();
