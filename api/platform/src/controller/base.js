const { RequestEndpointService }  = require('@iauu/services');
const { BadRequestException }     = require('@iauu/exceptions');
const { errorHandlerMiddleware }  = require('@iauu/middlewares');

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