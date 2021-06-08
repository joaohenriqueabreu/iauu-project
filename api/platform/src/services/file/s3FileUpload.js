const config      = require('../../env');
const fs          = require('fs');
const { v4: uid } = require('uuid');

const BaseService = require('../base');
const AWS = require('aws-sdk');

module.exports = class S3FileUploadService extends BaseService
{
    constructor(user) {
      super(user)

      this.uploadedFilePath = '';
      this.s3   = {};
    }

    async upload(file) {
      this.file = file;
      await this.initS3();
      await this.uploadToBucket();
      return this;
    }

    async initS3() {
      this.s3 = new AWS.S3({
        accessKeyId:      config.storage.key,
        secretAccessKey:  config.storage.secret
      })
    
      return this
    }

    async uploadToBucket() {
      // Read content from the file
      const fileContent   = fs.readFileSync(this.file.tempFilePath);
      const parts         = this.file.name.split('.');
      const originalName  = parts.shift();
      const fileExt       = parts.pop();
      const fileName      = `${uid()}.${fileExt}`;

      // Setting up S3 upload parameters
      const params = {
          Bucket: process.env.AWS_S3_APP_ASSETS_BUCKET,
          Key:    fileName,
          Body:   fileContent,
          ACL:    'public-read'
      };

      // Uploading files to the bucket
      
      // this.s3.upload(params, function(err, data) {
      //     if (err) { throw err }

      //     console.log(`File expected to be from ${process.env.CDN_APP_ASSETS_DOMAIN + '/' + fileName}`)
      //     this.uploadedFilePath = process.env.CDN_APP_ASSETS_DOMAIN + '/' + fileName
      //     console.log(`File uploaded successfully. ${data.Location}`);
      // })      
      const managedUpload = await this.s3.upload(params);

      try {
        const { Location } = await managedUpload.promise();
        console.log(`File expected to be served from ${process.env.CDN_APP_ASSETS_DOMAIN + '/' + fileName}`);
        console.log(`File uploaded successfully. ${Location }`);

        this.uploadedFilePath = Location;
      } catch (error) {
        throw error
      }

      return this
    }

    getFileUrl() {
      return this.uploadedFilePath
    }
}