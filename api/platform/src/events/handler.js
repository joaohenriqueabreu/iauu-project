const { EventEmitter } = require('events')

const eventHandler  = new EventEmitter();
module.exports      = eventHandler;