const BaseMessageService = require('./base');

module.exports = class GetMessageHistoryService extends BaseMessageService
{
  constructor(user, presentationId) {
    super(user, presentationId)

    this.chat = {};
  }

  async get() {
    await this.searchChat();
    return this;
  }

  getMessages() {
    if (this.chat != null) { return this.chat.messages; }
    return [];
  }
}
