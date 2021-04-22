const BaseController = require('./base');
const { 
  SearchProposalService, 
  SearchProposalsService, 
  SendProposalService, 
  SelectTimeslotService, 
  AcceptProposalService, 
  RejectProposalService, 
  SendCounterOfferService,
  AcceptCounterOfferService,
  RejectCounterOfferService,
} = require('../services/proposal');

class PresentationController extends BaseController {
  async searchUserProposals(req, res, next) {
    console.log('Searching user proposals...');
    const searchProposalsService = new SearchProposalsService();
    try {
      await searchProposalsService.search(req.user.role_id, req.data);
      res.status(200).json(searchProposalsService.getProposals());
    } catch (error) {
      next(error);
    }
  }

  async searchRoleProposals(req, res, next) {
    console.log('Searching role proposals...');
    const searchProposalsService = new SearchProposalsService();
    try {
      await searchProposalsService.search(req.data.id, req.data);
      res.status(200).json(searchProposalsService.getProposals());
    } catch (error) {
      next(error);
    }
  }

  async searchProposal(req, res, next) {
    console.log('Searching proposal...');
    const searchProposalService = new SearchProposalService();
    try {
      await searchProposalService.search(req.data.id);
      res.status(200).json(searchProposalService.getProposal());
    } catch (error) {
      next(error);
    }
  }

  async editProposal(req, res, next) {
    console.log('Updating proposal...');
    const updateProposalService = new ProposalService(req.data.id);
    try {
      await updateProposalService.update(req.data.proposal);
      res.status(200).json(updateProposalService.getProposal());
    } catch (error) {
      next(error);
    }
  }

  async sendProposal(req, res, next) {
    console.log('Starting to save proposal...');
    const sendProposalService = new SendProposalService(req.user);
    try {
      await sendProposalService.send(req.data.proposal, req.data.artist);
      res.status(200).json(sendProposalService.getProposal());
    } catch(error) {
      next(error);
    }
  }

  async selectTimeslot(req, res, next) {
    console.log('Updating timeslot...');
    const selectTimeslotService = new SelectTimeslotService(req.data.id);
    try {
      await selectTimeslotService.select(req.data.timeslot);
      res.status(200).json(selectTimeslotService.getProposal());
    } catch(error) {
      next(error);
    }
  }

  async sendCounterOffer(req, res, next) {
    console.log('Updating timeslot...');
    const sendCounterOfferService = new SendCounterOfferService(req.user, req.data);
    try {
      await sendCounterOfferService.send();
      res.status(200).json(sendCounterOfferService.getProposal());
    } catch(error) {
      next(error);
    }
  }

  async acceptCounterOffer(req, res, next) {
    console.log('Updating timeslot...');
    const acceptCounterOfferService = new AcceptCounterOfferService(req.user, req.data);
    try {
      await acceptCounterOfferService.reply();
      res.status(200).json(acceptCounterOfferService.getProposal());
    } catch(error) {
      next(error);
    }
  }

  async rejectCounterOffer(req, res, next) {
    console.log('Updating timeslot...');
    const rejectCounterOfferService = new RejectCounterOfferService(req.user, req.data);
    try {
      await rejectCounterOfferService.reply();
      res.status(200).json(rejectCounterOfferService.getProposal());
    } catch(error) {
      next(error);
    }
  }

  async acceptProposal(req, res, next) {
    console.log('Accepting proposal...');
    const acceptProposalService = new AcceptProposalService(req.user, req.data);
    const requestEndpointSvc    = new RequestEndpointService();
    
    try {
      await acceptProposalService.reply();
      const proposal = acceptProposalService.getProposal();
    } catch (error) {
      next(error);
    }

    try {
      const presentation = await requestEndpointSvc.post('presentation', proposal);
    } catch(error) {
      // TODO we should probably rollback accepting proposal here
      next(error);
    }

    res.status(200).json(proposal);
  }

  async rejectProposal(req, res, next) {
    console.log('Rejecting proposal...');
    const rejectProposalService = new RejectProposalService(req.user, req.data);
    try {
      await rejectProposalService.reply();
      res.status(200).json(rejectProposalService.getProposal());
    } catch(error) {
      next(error)
    }
  }
}

module.exports = new PresentationController();
