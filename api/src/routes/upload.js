const api = require('express').Router()
const fileUploadMiddleware = require('express-fileupload')

const fileUploadController = require('../controller/fileUpload')
const authorizationMiddleware = require('../middleware/authorization')
const validationMiddleware = require('../middleware/validation')

api.post('/', 
  authorizationMiddleware.authorize, 
  fileUploadMiddleware({ limits: { fileSize: 2 * 1024 * 1024 },  useTempFiles : true, tempFileDir : './tmp/' }), 
  validationMiddleware.files, 
  fileUploadController.upload
)

module.exports = api