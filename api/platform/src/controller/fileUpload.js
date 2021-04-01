'use strict'

const BaseController = require('./base')
const S3FileUploadService = require('../services/upload/s3FileUpload')

class FileUploadController extends BaseController {
  upload(req, res, next) {
    console.log('Uploading File...')
    const fileUploadService = new S3FileUploadService(req.user, req)
    fileUploadService.upload()
      .then(() => { res.status(200).json(fileUploadService.getFileUrl()) })
      .catch((error) => next(error))
  }
}

module.exports = new FileUploadController()
