const _                   = require('lodash');
const BaseMessageService  = require('./base');
const { Chat, Message }   = require('../models');

module.exports = class SaveMessageService extends BaseMessageService
{
  constructor(user, presentationId) {
    super(user, presentationId);

    this.chat = {};
  }

  async save(message) {    
    this.message = new Message(message);
    await this.searchChat()
    this.createIfFirstMessage()
      .setAuthor()
      .isValidMessage()
      .appendNewMessage();
    
    await this.saveMessage();
    return this;
  }

  createIfFirstMessage() {
    if (Chat.notFound(this.chat)) {
      console.log('Chat not found for presentation...');
      this.chat = new Chat({ presentation_id: this.id });
      console.log('Creating new chat...');
    }

    console.log('Chat found...');
    return this;
  }

  isValidMessage() {
    return this;
  }
 
  appendNewMessage() {
    console.log('Appending latest message...');
    this.chat.messages.push(this.message);
    return this;
  }

  setAuthor() {
    this.message.author = {
      id:     this.user.id,
      name:   this.user.name,
      photo:  this.user.photo,
    } 

    return this;
  }

  getLatestMessage() {
    return _.last(this.chat.messages);
  }
}
