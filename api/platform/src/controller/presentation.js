'use strict';

const BaseController                      = require('./base');
const SearchPresentationsService          = require('../services/presentation/searchPresentations');
const SearchPresentationService           = require('../services/presentation/searchPresentation');
const CompletePresentationService         = require('../services/presentation/completePresentation');
const CancelPresentationService           = require('../services/presentation/cancelPresentation');
const ManagePresentationChecklistService  = require('../services/presentation/manageChecklist');
const UpdatePresentationStatusService     = require('../services/presentation/updatePresentationStatus');
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

  async fetchPresentation(req, res, next) {
    try {
      const presentation = await Presentation.findById(req.data.id);
      if (!presentation instanceof Presentation) { throw new BadRequestException('Presentation does not exist'); }

      res.status(200).json(presentation);
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

  // async createPresentation(req, res, next) {
  //   console.log('Creating presentation from proposal...');
  //   const createPresentationSvc = new CreatePresentationService();
  //   try {
  //     await createPresentationSvc.create(req.data.proposal);
  //     const newPresentation = createPresentationSvc.getPresentation();
  //   } catch (error) {
  //     next(error);
  //   }

  //   // Send separate request to create billing for billing service
  //   try {
  //     const billing = await requestEndpointSvc.post('billing', { 
  //       presentation: newPresentation.id,
  //       artist:       newPresentation.artist.id,
  //       contractor:   newPresentation.contractor.id
  //     });
  //   } catch (error) {
  //     // TODO we should probably rollback presentation in case billing fails creating
  //     next(error);
  //   }

  //   res.status(200).json(newPresentation);
  // }

  completePresentation(req, res, next) {
    console.log('Confirming presentation...');
    const completePresentationService = new CompletePresentationService(req.user);
    completePresentationService.complete(req.data.id)
      .then(() => { res.status(200).json(completePresentationService.getPresentation()) })
      .catch((error) => next(error));
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

  getTypes(req, res, next) {  
    res.status(200).json(['anos 70', 'anos 80', 'anos 90', 'casamento', 'festa infantil', 'festa de 15 anos']);
  }
}

module.exports = new PresentationController();
