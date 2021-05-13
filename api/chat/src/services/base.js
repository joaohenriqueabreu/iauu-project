const { BaseService }         = require('lib/services');
const { Chat }                = require('../models');
const { BadRequestException } = require('lib/exception');

module.exports = class BaseMessageService extends BaseService
{
    constructor(user, data) {
      super(user)

      if (data === null || data === undefined) {
        throw new BadRequestException('Presentation required to search for message chat')
      }

      this.id   = data.id;
      this.user = user;
      this.chat = {};
    }

    async get() {
      await this.searchChat();
      return this;
    }

    async searchChat() {
      console.log('Searching presentation message chat...');
      this.chat = await Chat.findOne({ presentation: this.id });
      return this;
    }

    async saveMessage() {
      await this.chat.save();
      return this;
    }
}
