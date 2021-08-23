const Exception = require('./exception');

module.exports = class InvalidDataRequestException extends Exception { 
    constructor(message) {
        super(message || 'Invalid Data Requested');
        this.code = 500;
    }
}