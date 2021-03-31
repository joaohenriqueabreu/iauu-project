'use strict';

const BaseController = require('./base');
const SearchProposalsService = require('../services/presentation/searchProposals');
const SearchPresentationsService = require('../services/presentation/searchPresentations');
const SearchPresentationService = require('../services/presentation/searchPresentation');
const SendProposalService = require('../services/presentation/sendProposal');
const SelectTimeslotService = require('../services/presentation/selectTimeslot');
const AcceptProposalService = require('../services/presentation/acceptProposal');
const RejectProposalService = require('../services/presentation/rejectProposal');
const SendCounterOfferService = require('../services/presentation/sendCounterOffer');
const AcceptCounterOfferService = require('../services/presentation/acceptCounterOffer');
const RejectCounterOfferService = require('../services/presentation/rejectCounterOffer');
const CompletePresentationService = require('../services/presentation/completePresentation');
const CancelPresentationService = require('../services/presentation/cancelPresentation');
const ManagePresentationChecklistService = require('../services/presentation/manageChecklist');
const RequestEndpointService = require('lib/services/request');
const { Presentation } = require('../models');
const { BadRequestException } = require('../exception');

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

  searchProposals(req, res, next) {
    console.log('Searching proposals...');
    const searchProposalsService = new SearchProposalsService(req.user, req.data);
    searchProposalsService.search()
      .then(() => { res.status(200).json(searchProposalsService.getPresentations()) })
      .catch((error) => next(error));
  }

  searchPresentations(req, res, next) {
    console.log('Searching presentations...');
    const searchPresentationsService = new SearchPresentationsService(req.user, req.data);
    searchPresentationsService.search()
      .then(() => { res.status(200).json(searchPresentationsService.getPresentations()) })
      .catch((error) => next(error));
  }

  search(req, res, next) {
    console.log('Searching proposal...');
    const searchPresentationService = new SearchPresentationService(req.user);
    searchPresentationService.search(req.data.id)
      .then(() => { res.status(200).json(searchPresentationService.getPresentation()) })
      .catch((error) => next(error));
  }

  sendProposal(req, res, next) {
    console.log('Starting to save proposal...');
    const sendProposalService = new SendProposalService(req.user, req.data);
    sendProposalService.save()
      .then(() => { res.status(200).json({}) })
      .catch((error) => next(error));
  }

  selectTimeslot(req, res, next) {
    console.log('Updating timeslot...');
    const selectTimeslotService = new SelectTimeslotService(req.user, req.data);
    selectTimeslotService.select()
      .then(() => { res.status(200).json(selectTimeslotService.getPresentation()) })
      .catch((error) => next(error));
  }

  sendCounterOffer(req, res, next) {
    console.log('Updating timeslot...');
    const sendCounterOfferService = new SendCounterOfferService(req.user, req.data);
    sendCounterOfferService.send()
      .then(() => { res.status(200).json(sendCounterOfferService.getPresentation()) })
      .catch((error) => next(error));
  }

  acceptCounterOffer(req, res, next) {
    console.log('Updating timeslot...');
    const acceptCounterOfferService = new AcceptCounterOfferService(req.user, req.data);
    acceptCounterOfferService.reply()
      .then(() => { res.status(200).json(acceptCounterOfferService.getPresentation()) })
      .catch((error) => next(error));
  }

  rejectCounterOffer(req, res, next) {
    console.log('Updating timeslot...');
    const rejectCounterOfferService = new RejectCounterOfferService(req.user, req.data);
    rejectCounterOfferService.reply()
      .then(() => { res.status(200).json(rejectCounterOfferService.getPresentation()) })
      .catch((error) => next(error));
  }

  async acceptProposal(req, res, next) {
    console.log('Accepting proposal...');
    const acceptProposalService = new AcceptProposalService(req.user, req.data);
    const requestEndpointSvc = new RequestEndpointService();
    let newPresentation = {};
    
    try {
      await acceptProposalService.reply();
      newPresentation = acceptProposalService.getPresentation();
    } catch (error) {
      next(error);
    }

    // Send separate request to create billing for billing service
    try {
      await requestEndpointSvc.post('billing', { 
        presentation: newPresentation.id,
        artist: newPresentation.artist.id,
        contractor: newPresentation.contractor.id
      });
    } catch (error) {
      // TODO we should probably rollback presentation in case billing fails creating
      next(error);
    }

    res.status(200).json(newPresentation);
  }

  rejectProposal(req, res, next) {
    console.log('Rejecting proposal...');
    const rejectProposalService = new RejectProposalService(req.user, req.data);
    rejectProposalService.reply()
      .then(() => { res.status(200).json(rejectProposalService.getPresentation()) })
      .catch((error) => next(error));
  }

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

  getTypes(req, res, next) {  
    res.status(200).json(['anos 70', 'anos 80', 'anos 90', 'casamento', 'festa infantil', 'festa de 15 anos']);
  }
}

module.exports = new PresentationController()
