const api = require('express').Router();

const { validationMiddleware } = require('@iauu/middlewares')
const categoryController = require('../controller/category')

api.get('/', categoryController.categories)
api.get('/:category/subcategories', validationMiddleware.category, categoryController.subcategories)

module.exports = api