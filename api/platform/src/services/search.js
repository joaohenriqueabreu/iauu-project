const BaseService = require('./base');

module.exports = class SearchService extends BaseService {
    constructor() {
        super();

        this.shouldFailWhenNotFound = true;
    }

    shouldNotFailIfNotFound() {
        this.shouldFailWhenNotFound = false;
        return this;
    }
}