const UpdatePresentationService = require('./updatePresentation');

module.exports = class UpdatePresentationStatusService extends UpdatePresentationService {
  constructor(id) {
    super(id);
  }

  async update(status) {
    this.presentationData = { status: status};

    // TODO do other custom validations
    this.ensurePresentationWasFound()
      .populatePresentation();

    await this.savePresentation();
  }
}