const BaseController = require( './base');
const SearchPresentationFeedbackService = require('../services/feedback/searchPresentationFeedback');
const SearchArtistFeedbacksService = require('../services/feedback/searchArtistFeedbacks');
const SaveFeedbackService = require('../services/feedback/saveFeedback');

class FeedbackController extends BaseController {
  async presentationFeedback(req, res, next) {
    console.log('Requesting presentation feedback...');

    const searchPresentationFeedbackSvc = new SearchPresentationFeedbackService(req.user);
    try {
      await searchPresentationFeedbackSvc.search(req.data.id);
      res.status(200).json(searchPresentationFeedbackSvc.getFeedback());
    } catch (error) {
      next(error);
    }
  }

  async artistFeedbacks(req, res, next) {
    console.log('Requesting artist feedbacks...');

    const searchArtistFeedbacksSvc = new SearchArtistFeedbacksService(req.user);
    try {
      await searchArtistFeedbacksSvc.search(req.data.id);
      res.status(200).json(searchArtistFeedbacksSvc.getFeedbacks());
    } catch (error) {
      next(error);
    }
  }

  async saveFeedback(req, res, next) {
    console.log('Saving presentation feedback...');

    const saveFeedbackSvc = new SaveFeedbackService(req.user);
    try {
      await saveFeedbackSvc.save(req.data);
      res.status(200).json(saveFeedbackSvc.getFeedback());
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FeedbackController();