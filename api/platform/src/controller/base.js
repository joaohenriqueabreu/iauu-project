const RequestEndpointService      = require('iauu/services/request');
const { BadRequestException }     = require('iauu/exception');
const { errorHandlerMiddleware }  = require('iauu/middleware');

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