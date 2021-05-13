const BaseService  = require('../base');
const RequestEndpointService  = require('lib/services/request');
const { BadRequestException }  = require('../../exception');
const { Feedback }  = require('../../models');

module.exports = class SendFeedbackService extends BaseService
{
    constructor(user) {
      super(user);

      this.user = user;
      this.feedback = {};
      this.requestEndpointSvc = new RequestEndpointService();
    }

    async save(data) {
      this.feedbackData = data;
      this.ensureFeedbackIsValid()
        .populateFeedbackModel();

      // await this.ensurePartiesExist();
      await this.saveFeedback();
      return this;
    }

    ensureFeedbackIsValid() {
      return this;
    }

    // async ensurePartiesExist() {
    //   try {
    //     console.log('Verifying parties services...');
    //     await this.requestEndpointSvc.get(`/artists/${this.feedback.artist_id}/validate`);
    //     await this.requestEndpointSvc.get(`/presentations/${this.feedback.presentation_id}/validate`);
    //   } catch (error) {
    //     console.log(error);
    //     throw new BadRequestException('Invalid parties provided');
    //   }

    //   console.log('Parties exists...');
    //   return this;
    // }

    populateFeedbackModel() {
      console.log('Populating feedback...');
      this.feedback                 = new Feedback(this.feedbackData);
      this.feedback.artist_id       = this.feedbackData.artist;
      this.feedback.presentation_id = this.feedbackData.presentation;
      this.feedback.from            = {
        contractor_id:  this.user.id,
        name:           this.user.name,
        photo:          this.user.photo
      };

      return this;
    }


    async saveFeedback() {
      await this.feedback.save();
      console.log('Presentation Feedback saved');
      return this;
    }

    getFeedback() {
      return this.feedback;
    }
}