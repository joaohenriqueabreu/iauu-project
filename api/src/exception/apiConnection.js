const Exception = require('./exception');

module.exports = class FailedAPIConnectionException extends Exception { 
    constructor(message) {
        super(message || 'Failed to connect to API.');
        this.code = 500;
    }
}