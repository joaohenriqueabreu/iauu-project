const RequestEndpointService = require('lib/services/request');

module.exports = class BaseService {
    constructor() {
        this.requestNotificationEndpointSvc = new RequestEndpointService('notification');
    }
}