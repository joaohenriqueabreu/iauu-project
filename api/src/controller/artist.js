'use strict';

const BaseController = require('./base');
const PublicArtistProfileService = require('../services/artist/publicSearch');
const SearchArtistForProposalService = require('../services/artist/searchArtistForProposal');
const SearchArtistProfileService = require('../services/artist/searchProfile');
const SaveArtistProfileService = require('../services/artist/saveProfile');
const SaveArtistAccountService = require('../services/payment/saveArtistAccount');
const SaveProductService = require('../services/artist/saveProduct');
const DeleteProductService = require('../services/artist/deleteProduct');
const LookupProductsService = require('../services/artist/lookupProducts');

class ArtistController extends BaseController {
  async validateArtist(req, res, next) {
    try {
      // No need for a service here
    } catch (error) {
      next(error);
    }
  }

  async publicInfo(req, res, next) {
    console.log("Requesting artist public...");

    const publicArtistProfileService = new PublicArtistProfileService(req.user, req.data);
    try {
      await publicArtistProfileService.search(req.user, req.data);
      res.status(200).json(publicArtistProfileService.getArtist());
    } catch (error) {
      next(error);
    }
  }

  async privateInfo(req, res, next) {    
    console.log("Requesting artist private...");

    const searchArtistForProposalService = new SearchArtistForProposalService(req.user, req.data);
    try {
      await searchArtistForProposalService.search(req.user, req.data);
      res.status(200).json(searchArtistForProposalService.getArtist());
    } catch (error) {
      next(error);
    }
  }

  async profile(req, res, next) {
    console.log("Requesting artist...");
    const searchProfileService = new SearchArtistProfileService(req.user, req.data);
    try {
      await searchProfileService.search();
      res.status(200).json(searchProfileService.getArtist());
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    console.log("Updating profile...");
    const saveProfileService = new SaveArtistProfileService(req.user, req.data);
    try {
      await saveProfileService.save();
      res.status(200).json(saveProfileService.getArtist());
    } catch (error) {
      next(error);
    }
  }

  async saveBankAccount(req, res, next) {
    console.log("Saving bank account...");
    const saveArtistAccountSvc = new SaveArtistAccountService(req.user);
    try {
      await saveArtistAccountSvc.save(req.data.bankAccount);
      res.status(200).json(saveArtistAccountSvc.getArtist());
    } catch (error) {
      next(error);
    }
  }

  async products(req, res, next) {
    console.log("Looking up products...");
    const lookupProductsService = new LookupProductsService(req.user, req.data);
    try {
      await lookupProductsService.lookup();
      res.status(200).json(lookupProductsService.getProducts());
    } catch (error) {
      next(error);
    }
  }

  async saveProduct(req, res, next) {
    console.log('Starting to save product...');
    const saveProductService = new SaveProductService(req.user, req.data);
    try {
      await saveProductService.save();
      res.status(200).json(saveProductService.getProducts());
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    const deleteProductService = new DeleteProductService(req.user, req.data);
    try {
      await deleteProductService.delete();
      res.status(200).json(deleteProductService.getProducts());
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ArtistController();
