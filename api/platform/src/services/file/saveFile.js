const BaseService = require('../base');
const { File }    = require('../../models');

module.exports = class SaveFileService extends BaseService {
  constructor(file) {
    super();
    this.uplodedFile = file;
  }

  async save(url) {
    this.file       = new File(this.uplodedFile);
    this.file.url   = url;
    // this.file.name  = this.uplodedFile.name;
    // this.file.size  = this.uplodedFile.size;
    this.file.type  = this.uplodedFile.mimetype;

    await this.file.save();
    return this;
  }

  getFile() {
    return this.file;
  }
}