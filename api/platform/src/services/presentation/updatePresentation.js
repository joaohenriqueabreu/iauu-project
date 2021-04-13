const PresentationService = require('./base');

module.exports = class UpdatePresentationService extends PresentationService {
  constructor(user, presentation) {
    super(user);

    this.presentation = presentation;
  }

  async update(data) {
    this.presentationData = data;

    this.ensurePresentationWasFound()
      .populatePresentation();

    await this.savePresentation();
  }

  populatePresentation() {
    this.presentation = { ...this.presentation, ...this.presentationData };
    return this;
  }
}