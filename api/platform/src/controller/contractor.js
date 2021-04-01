'use strict';

const BaseController = require('./base');
const SearchArtistsService = require('../services/artist/searchArtists');
const SearchContractorProfileService = require('../services/contractor/searchProfile');
const SaveContractorProfileService = require('../services/contractor/saveProfile');
const { Contractor } = require('../models');
const { BadRequestException } = require('../exception');

class ContractorController extends BaseController {
  async validateContractor(req, res, next) {
    try {
      console.log(`Validating contractor ${req.data.id}`);
      const exists = await Contractor.exists({_id: req.data.id});
      if (!exists) { throw new BadRequestException('Contractor does not exist'); }

      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  }

  async fetchContractor(req, res, next) {
    try {
      console.log(`Fetching contractor ${req.data.id}`);
      const contractor = await Contractor.findById(req.data.id);
      if (!contractor instanceof Contractor) { throw new BadRequestException('Contractor does not exist'); }
      
      res.status(200).json(contractor);
    } catch (error) {
      next(error);
    }
  }


  searchArtists(req, res, next) {
    console.log('Searching for artists...');
    const searchArtistsService = new SearchArtistsService(req.user, req.data)
    searchArtistsService.search()
      .then(() => { res.status(200).json(searchArtistsService.getArtists()); })
      .catch((error) => next(error));
  }

  profile(req, res, next) {
    console.log('Requesting contractor profile...');
    const searchProfileService = new SearchContractorProfileService(req.user, req.data);
    searchProfileService.search()
      .then(() => { res.status(200).json(searchProfileService.getContractor()); })
      .catch((error) => next(error));
  }

  updateProfile(req, res, next) {
    console.log('Updating profile...');
    const saveProfileService = new SaveContractorProfileService(req.user, req.data);
    saveProfileService.save()
      .then(() => { res.status(200).json(saveProfileService.getContractor()); })
      .catch((error) => next(error));
  }
}

module.exports = new ContractorController();