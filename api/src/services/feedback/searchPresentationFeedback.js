const BaseService = require("../base");
const Feedback = require("../../models/feedback");

module.exports = class SearchPresentationFeedbackService extends BaseService
{
    constructor(user) {
      super();

      this.user = user;
      this.feedback = {}
    }

    async search(presentationId) {
      this.id = presentationId;
      await this.searchPresentationFeedback();

      return this;
    }

    async searchPresentationFeedback() {
      this.feedback = await Feedback.find({ presentation_id: this.id });
      return this;
    }

    getFeedback() {
      return this.feedback;
    }
}
