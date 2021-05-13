const S3FileUploadService = require('./s3FileUpload');
const SaveFileService     = require('./saveFile');
const SearchFileService   = require('./searchFile');

module.exports = {
  SaveFileService,
  SearchFileService,
  S3FileUploadService,
}