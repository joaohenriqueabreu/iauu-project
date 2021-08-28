const { map, filter}      = require('lodash');
const moment              = require('moment');
const PresentationService = require('./base')
const { Document }        = require('../../models/schemas');
const { EVENTS } = require('@iauu/events');

module.exports = class PresentationDocumentService extends PresentationService
{
    constructor(user, id) {
      super(user);

      this.id = id;
    }

    async upload(file) {
      await this.searchPresentation();
      this.ensurePresentationWasFound()
        .appendDocument(file);

      await this.savePresentation();
      return this;
    }

    async update(document) {
      await this.searchPresentation();
      this.ensurePresentationWasFound()
        .editDocument(document);  

      await this.savePresentation();  
      if (document.requires_approval && !document.is_approved) {    
        this.emitDocSentForApprovalEvent(document);
      }

      return this;
    }

    // TODO check if user can approve/reject document
    async approve(document) {
      document.approval.approved    = true;
      document.approval.approval_dt = moment().toString();
      await this.update(document);
      return this;
    }

    async reject(document) {
      document.approval.approved    = false;
      document.approval.approval_dt = moment().toString();
      await this.update(document);
      return this;
    }

    async delete(document) {
      await this.searchPresentation();
      this.ensurePresentationWasFound()
        .removeDocument(document);

      await this.savePresentation();
      
      // TODO change to something that S3 will find (probably url)
      // TODO also, should delete file first - maybe sync event here instead
      this.emitEvent(EVENTS.DELETE_FILE_EVENT, documentId);
      return this;
    }

    appendDocument(file) {
      this.presentation.documents.push(new Document({
        file_id:      file.id,
        uploaded_by:  this.user.main_role,
      }));

      return this;
    }

    editDocument(updatedDocument) {
      this.presentation.documents = map(this.presentation.documents, (existingDocument) => {
        return existingDocument.id !== updatedDocument.id ? existingDocument : updatedDocument;
      });

      return this;
    }

    removeDocument(document) {
      this.presentation.documents = filter(this.presentation.documents, (existingDocument) => existingDocument.id !== document.id);
      return this;
    }

    async emitDocSentForApprovalEvent(document) {
      const otherParty = await this.getDocTargetUser(document)

      this.emitEvent(EVENTS.DOCUMENT_SENT_FOR_APPROVAL_EVENT, {
        presentation: { id: this.presentation.id, name: this.presentation.title },
        user:         { name: otherParty.name }
      })
    }

    async getDocTargetUser(document) {
      const otherParty = document.uploaded_by === 'artist' 
        ? { id: this.presentation.contractor_id, enpoint: 'contractor' }
        : { id: this.presentation.artist_id, enpoint: 'artist' }

      otherParty = await this.requestEndpointSvc.get(otherParty.endpoint, id);
      console.log(otherParty)

      return otherParty;
    }
}
