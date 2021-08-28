const api = require('express').Router()
const fileUploadMiddleware = require('express-fileupload')

const FileController = require('../controller/file')
const { authorizationMiddleware, validationMiddleware } = require('@iauu/middlewares');

api.post('/',   authorizationMiddleware.authorize, fileUploadMiddleware({ limits: { fileSize: 2 * 1024 * 1024 },  useTempFiles : true, tempFileDir : './tmp/' }), validationMiddleware.uploadedFiles, FileController.upload)
api.get('/:id', authorizationMiddleware.authorize, validationMiddleware.id, FileController.search)

module.exports = api