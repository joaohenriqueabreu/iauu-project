const Exception = require('./exception');

module.exports = class EventBrokerException extends Exception { 
    constructor(message, error) {
        super(message, error);
        this.code = 500;
    }
}