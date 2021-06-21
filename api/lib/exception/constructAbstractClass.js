const Exception = require('./exception');

module.exports = class CannotConstructAbstractClassException extends Exception { 
    constructor() {
        super('Cannot construct abstract class');
        this.code = 500;
    }
}