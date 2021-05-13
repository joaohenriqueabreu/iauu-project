const BaseService = require('../base');
const Feedback = require('../../models/feedback');

module.exports = class SearchArtistFeedbacksService extends BaseService
{
    constructor(user) {
      super();
      this.user       = user;
      this.feedbacks  = [];
    }

    async search(artistId) {
      this.feedbacks = await Feedback.find({ artist_id: artistId });
      
      return this;
    }

    getFeedbacks() {
      return this.feedbacks;
    }
}
