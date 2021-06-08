const BaseService = require('../base');
const { File }    = require('../../models');
const { BadRequestException } = require('iauu/exception');

module.exports = class SearchFileService extends BaseService {
  constructor() {
    super();

    this.file = {}
  }

  async search(id) {
    await this.searchFile(id);
    this.ensureFileWasFound();

    return this;
  }
  
  async searchFile(id) {
    this.file = await File.findById(id);
    return this;
  }

  ensureFileWasFound() {
    if (File.notFound(this.file)) {
      throw new BadRequestException('File not found');
    }

    return this;
  }

  getFile() {
    return this.file;
  }
}