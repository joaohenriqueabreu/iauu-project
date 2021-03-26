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
      this.presentation = presentationId;

      return this;
    }
}
