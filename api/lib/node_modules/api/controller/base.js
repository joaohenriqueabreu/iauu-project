const { errorHandlerMiddleware } = require('lib/middleware');

module.exports = class Controller {  
  constructor() {

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