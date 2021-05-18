const { BaseService }         = require('lib/services');
const { Chat }                = require('../models');
const { BadRequestException, ModelValidationException } = require('lib/exception');

module.exports = class BaseMessageService extends BaseService
{
    constructor(user, presentationId) {
      super(user);

      // if (data === null || data === undefined) {
      //   throw new BadRequestException('Presentation required to search for message chat')
      // }

      this.id   = presentationId;
      this.user = user;
      this.chat = {};
    }

    async get() {
      await this.searchChat();
      return this;
    }

    async searchChat() {
      console.log('Searching presentation message chat...');
      this.chat = await Chat.findOne({ presentation_id: this.id });
      return this;
    }

    async saveMessage() {
      console.log('Saving message...');
      console.log(this.chat);
      console.log(this.chat.messages[0])
      try {
        await this.chat.save();
      } catch (error) {
        console.log(error);
        throw ModelValidationException(error);
      }
      
      console.log('Message saved...');
      return this;
    }
}
