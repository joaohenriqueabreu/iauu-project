'use strict'

const BaseController      = require('./base');
const { SearchFileService, SaveFileService, S3FileUploadService } = require('../services/file');

class FileController extends BaseController {
  async search(req, res, next) {
    console.log('Searching for file...');
    const searchFileSvc = new SearchFileService();

    try {
      await searchFileSvc.search(req.data.id);
      res.status(200).json(searchFileSvc.getFile());
    } catch (error) {
      next(error);
    }
  }

  async upload(req, res, next) {
    console.log('Uploading File...')
    const fileUploadService = new S3FileUploadService(req.user)    
    try {
      await fileUploadService.upload(req.files.data);
    } catch (error) {
      next(error);
    }

    const saveFileSvc = new SaveFileService(req.files.data);
    try {
      await saveFileSvc.save(fileUploadService.getFileUrl());
      res.status(200).json(saveFileSvc.getFile());
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    console.log('Deleting file...');

    const saveFileSvc = new SaveFileService(req.files);
    try {
      await saveFileSvc.delete(fileUploadService.getFileUrl());
      res.status(200).json(fileUploadService.getFileUrl());
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FileController();
