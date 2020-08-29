'use strict'
const faker = require('faker')
const BaseController = require('./base')

class CategoryController extends BaseController {
  categories(req, res, next) {
    res.status(200).json([
        { id: faker.random.number(100), name: 'banda' },
        { id: faker.random.number(100), name: 'DJ' },
        { id: faker.random.number(100), name: 'teatro' },
        { id: faker.random.number(100), name: 'circo' },
        { id: faker.random.number(100), name: 'standup' },
        { id: faker.random.number(100), name: 'outros' }
    ])
  }
  
  subcategories(req, res) {
    let subcategories = {
      'banda': [
        'pop', 'rock', 'sertanejo', 'sertanejo universitário', 'samba', 'pagode', 'gafieira', 'tango', 'jazz', 'soul', 'blues', 
        'metal', 'thrash metal', 'metal melódico', 'k-pop', 'flamenco', 'eletrônico', 'punk rock', 'anos 80', 'anos 90', 'casamento', 
        'mpb', 'folclore'
      ]
    }

    let genericTags = ['anos 70', 'anos 80', 'anos 90', 'casamento', 'festa infantil', 'festa de 15 anos']
  
    res.status(200).json({ ...subcategories[req.data.category], ...genericTags })
  }
}

module.exports = new CategoryController()