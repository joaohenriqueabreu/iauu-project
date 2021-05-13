const _                   = require('lodash');
const BaseMessageService  = require('./base');
const { Chat }            = require('../models');

module.exports = class SaveMessageService extends BaseMessageService
{
  constructor(user, data) {
    super(user, data)

    this.chat = {}
    this.message = data.message
  }

  async save() {
    await this.searchChat()
    this.createIfFirstMessage()
      .isValidMessage()
      .appendNewMessage()
      .setUser()
    
    await this.saveMessage()
    return this
  }

  createIfFirstMessage() {
    if (Chat.notFound(this.chat)) {
      console.log('Chat not found for presentation...')
      this.chat = new Chat({ presentation: this.id })
    }

    console.log('Chat found...')
    return this
  }

  isValidMessage() {
    return this
  }
 
  appendNewMessage() {
    console.log('Appending latest message...')
    this.chat.messages.push(this.message)
    return this
  }

  setUser() {
    this.message.author.id = this.user.id
    return this
  }

  getLatestMessage() {
    console.log(this.chat)
    console.log(this.chat.messages)
    return _.last(this.chat.messages)
  }
}
