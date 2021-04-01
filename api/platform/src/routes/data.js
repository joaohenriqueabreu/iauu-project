const api = require('express').Router();

const staticDataController = require('../controller/staticData');
api.get('/banks', staticDataController.banks);

module.exports = api;