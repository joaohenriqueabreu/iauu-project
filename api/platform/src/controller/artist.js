const BaseController              = require('./base');
const SearchArtistsService        = require('../services/artist/searchArtists');
const PublicArtistProfileService  = require('../services/artist/publicSearch');
const SearchArtistService         = require('../services/artist/searchArtist');
const SearchArtistProfileService  = require('../services/artist/searchProfile');
const SaveArtistProfileService    = require('../services/artist/saveProfile');
const SaveProductService          = require('../services/artist/saveProduct');
const DeleteProductService        = require('../services/artist/deleteProduct');
const SearchProductsService       = require('../services/artist/searchProducts');
const { Artist }                  = require('../models');


class ArtistController extends BaseController {
  async validateArtist(req, res, next) {
    try {
      console.log(`Validating artist ${req.data.id}`);
      const exists = await Artist.exists({_id: req.data.id});
      if (!exists) { throw new BadRequestException('Artist does not exist'); }

      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  }

  async searchArtists(req, res, next) {
    console.log('Searching for artists...');
    const searchArtistsService = new SearchArtistsService(req.user)
    try {
      await searchArtistsService.search(req.data);
      res.status(200).json(searchArtistsService.getArtists());
    } catch (error) {
      next(error);
    }
  }

  async searchArtist(req, res, next) {
    console.log('Requesting artist...');

    const searchArtistSvc = new SearchArtistService(req.user);
    try {
      await searchArtistSvc.search(req.data.id);
      res.status(200).json(searchArtistSvc.getArtist());
    } catch (error) {
      next(error);
    }
  }

  async publicInfo(req, res, next) {
    console.log('Requesting artist public...');

    const publicArtistProfileService = new PublicArtistProfileService(req.user, req.data);
    try {
      await publicArtistProfileService.search(req.data.slug);
      res.status(200).json(publicArtistProfileService.getArtist());
    } catch (error) {
      next(error);
    }
  }

  async privateInfo(req, res, next) {
    console.log('Requesting artist...');

    const searchArtistSvc = new SearchArtistService(req.user);
    try {
      await searchArtistSvc.search(req.data.id);
      res.status(200).json(searchArtistSvc.getArtist());
    } catch (error) {
      next(error);
    }
  }

  async profile(req, res, next) {
    console.log('Requesting artist...');
    const searchProfileService = new SearchArtistProfileService(req.user, req.data);
    try {
      await searchProfileService.search();
      res.status(200).json(searchProfileService.getArtist());
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    console.log('Updating profile...');
    const saveProfileService = new SaveArtistProfileService(req.user, req.data);
    try {
      await saveProfileService.save();
      res.status(200).json(saveProfileService.getArtist());
    } catch (error) {
      next(error);
    }
  }

  async products(req, res, next) {
    console.log('Searching artist products...');
    const searchProductsService = new SearchProductsService(req.user.role_id);
    try {
      await searchProductsService.search();
      res.status(200).json(searchProductsService.getArtist());
    } catch (error) {
      next(error);
    }
  }

  async productsForProposal(req, res, next) {
    console.log('Searching products for proposal...');
    const searchProductsService = new SearchProductsService(req.data.id);
    try {
      await searchProductsService.search();
      res.status(200).json(searchProductsService.getArtist());
    } catch (error) {
      next(error);
    }
  }

  async saveProduct(req, res, next) {
    console.log('Starting to save product...');
    const saveProductService = new SaveProductService(req.user, req.data);
    try {
      await saveProductService.save();
      res.status(200).json(saveProductService.getArtist());
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    const deleteProductService = new DeleteProductService(req.user);
    try {
      await deleteProductService.delete(req.data.id);
      res.status(200).json(deleteProductService.getArtist());
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ArtistController();
