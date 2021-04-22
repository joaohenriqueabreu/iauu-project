const Exception = require('./exception');

module.exports = class InterfaceNotImplementedException extends Exception { 
    constructor() {
        // TODO get the caller function name and append to message
        super(`Must implement interface`);
        this.code = 500;
    }
}