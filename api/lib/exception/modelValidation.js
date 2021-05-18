const Exception = require('./exception');

module.exports = class ModelValidationException extends Exception { 
    constructor(message) {
        super(message);
        this.code = 500;
    }
}