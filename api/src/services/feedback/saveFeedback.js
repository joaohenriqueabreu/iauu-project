const axios = require('axios');
const BaseService  = require('../base');
const { BadRequestException }  = require('../../exception');
const { Feedback }  = require('../../models');

module.exports = class SendFeedbackService extends BaseService
{
    constructor(user) {
      super(user)

      this.user = this.user;
      this.feedback = {};
    }

    async save(data) {
      this.feedbackData = data;
      this.ensureFeedbackIsValid()
        .populateFeedbackModel();

      await this.ensurePartiesExist();
      await this.saveFeedback();
      return this;
    }

    ensureFeedbackIsValid() {
      if (data.artist === undefined || data.presentation === undefined || data.rating === undefined || data.contractor === undefined) {
        throw new BadRequestException('Missing required feedback information');
      }

      return this;
    }

    async ensurePartiesExist() {
      try {
        await axios.head(`/artists/${this.feedback.artist_id}/exists`);
        await axios.head(`/presentations/${this.feedback.presentation_id}/exists`);
      } catch (error) {
        throw new BadRequestException('Invalid parties provided');
      }
    }

    populateFeedbackModel() {
      this.feedback = new Feedback(this.feedbackData);
      this.feedback.artist_id = this.feedbackData.artist;
      this.feedback.presentation_id = this.feedbackData.presentation;
      this.feedback.from = {
        contractor_id: this.feedbackData.contractor.id,
        name: this.feedbackData.contractor.name,
        photo: this.feedbackData.contractor.photo
      };

      return this;
    }


    async saveFeedback() {
      await this.feedback.save();
      return this;
    }
}