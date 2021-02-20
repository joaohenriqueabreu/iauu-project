const Exception = require('./exception');

module.exports = class BadRequestException extends Exception { 
    constructor(message) {
        if (message === undefined) { message = 'Manual payment required.' }
        super(message);
        this.code = 500;
    }
}