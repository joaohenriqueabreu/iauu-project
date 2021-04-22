const RequestEndpointService      = require('lib/services/request');
const { BadRequestException }     = require('lib/exception');
const { errorHandlerMiddleware }  = require('lib/middleware');

module.exports = class Controller {  
  constructor() {
    this.requestEndpointSvc = new RequestEndpointService();
  }

  handleRequest(handler) {
    try {
      const result = handler
      res.status(200).json(result)  
    } catch (error) {
      errorHandlerMiddleware.handle(res, error)
    }   
  }
}