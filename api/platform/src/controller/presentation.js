'use strict';

const BaseController                      = require('./base');
const SearchPresentationsService          = require('../services/presentation/searchPresentations');
const SearchPresentationService           = require('../services/presentation/searchPresentation');
const CompletePresentationService         = require('../services/presentation/completePresentation');
const CancelPresentationService           = require('../services/presentation/cancelPresentation');
const ManagePresentationChecklistService  = require('../services/presentation/manageChecklist');
const UpdatePresentationStatusService     = require('../services/presentation/updatePresentationStatus');
const PresentationDocumentService         = require('../services/presentation/presentationDocument');
// const CreatePresentationService           = require('../services/presentation/createPresentation');
const { Presentation }                    = require('../models');
const { BadRequestException }             = require('../exception');

class PresentationController extends BaseController {
  async validatePresentation(req, res, next) {
    try {
      const exists = await Presentation.exists({_id: req.data.id});
      if (!exists) { throw new BadRequestException('Presentation does not exist'); }

      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  }

  async searchUserPresentations(req, res, next) {
    console.log('Searching presentations...');
    const searchPresentationsSvc = new SearchPresentationsService();
    try {
      await searchPresentationsSvc.search(req.user.role_id, req.data);
      res.status(200).json(searchPresentationsSvc.getPresentations());
    } catch (error) {
      next(error);
    }
  }

  async searchRolePresentations(req, res, next) {
    console.log('Searching role presentations...');
    const searchPresentationsSvc = new SearchPresentationsService();
    try {
      await searchPresentationsSvc.search(req.data.id);
      res.status(200).json(searchPresentationsSvc.getPresentations());
    } catch (error) {
      next(error);
    }
  }

  async search(req, res, next) {
    console.log('Searching presentation...');
    const searchPresentationService = new SearchPresentationService(req.user);
    try {
      await searchPresentationService.search(req.data.id);
      res.status(200).json(searchPresentationService.getPresentation())
    } catch (error) {
      next(error);
    }
  }

  async completePresentation(req, res, next) {    
    console.log('Confirming presentation...');
    const completePresentationService = new CompletePresentationService(req.user);
    try {
      await completePresentationService.complete(req.data.id);
      res.status(200).json(completePresentationService.getPresentation())
    } catch (error) {
      next(error);
    }
  }

  cancelPresentation(req, res, next) {
    console.log('Cancelling presentation...');
    const cancelPresentationService = new CancelPresentationService(req.user, req.data);
    cancelPresentationService.cancel()
      .then(() => { res.status(200).json(cancelPresentationService.getPresentation()) })
      .catch((error) => next(error));
  }

  // TODO change for actual edit service if necessary
  async editPresentation(req, res, next) {
    console.log('Creating checklist...');
    const manageChecklistSvc = new ManagePresentationChecklistService(req.data.id);
    try {
      await manageChecklistSvc.update(req.data);
      res.status(200).json(manageChecklistSvc.getPresentation());
    } catch (error) {
      next(error);
    }
  }

  async updatePresentationStatus(req, res, next) {
    console.log('Updating presentation status...');
    const updatePresentationStatusSvc = new UpdatePresentationStatusService(req.data.id);
    try {
      await updatePresentationStatusSvc.update(req.data.status);
      res.status(200).json(updatePresentationStatusSvc.getPresentation());
    } catch (error) {
      next(error);
    }
  }

  async uploadDocument(req, res, next) {
    console.log('Uploading presentation document...');
    const presentationDocumentSvc = new PresentationDocumentService(req.user, req.data.id);
    try {
      await presentationDocumentSvc.upload(req.data.file);
      res.status(200).json(presentationDocumentSvc.getPresentation());
    } catch (error) {
      next(error);
    }
  }

  async editDocument(req, res, next) {
    console.log('Updating document...');
    const presentationDocumentSvc = new PresentationDocumentService(req.user, req.data.id);
    try {
      await presentationDocumentSvc.update(req.data.document);
      res.status(200).json(presentationDocumentSvc.getPresentation());
    } catch (error) {
      next(error);
    }
  }

  async approveDocument(req, res, next) {
    console.log('Approving document...');
    const presentationDocumentSvc = new PresentationDocumentService(req.user, req.data.id);
    try {
      await presentationDocumentSvc.approve(req.data.document);
      res.status(200).json(presentationDocumentSvc.getPresentation());
    } catch (error) {
      next(error);
    }
  }

  async rejectDocument(req, res, next) {
    console.log('Rejecting document...');
    const presentationDocumentSvc = new PresentationDocumentService(req.user, req.data.id);
    try {
      await presentationDocumentSvc.update(req.data.document);
      res.status(200).json(presentationDocumentSvc.getPresentation());
    } catch (error) {
      next(error);
    }
  }

  async deleteDocument(req, res, next) {
    console.log('Deleting presentation document...');
    const presentationDocumentSvc = new PresentationDocumentService(req.user, req.data.id);
    try {
      await presentationDocumentSvc.delete(req.data.document);
      res.status(200).json(presentationDocumentSvc.getPresentation());
    } catch (error) {
      next(error);
    }
  }

  getTypes(req, res, next) {  
    res.status(200).json(['anos 70', 'anos 80', 'anos 90', 'casamento', 'festa infantil', 'festa de 15 anos']);
  }
}

module.exports = new PresentationController();
