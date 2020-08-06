// const db = require('../../data/db')
const db = require('mongoose')

module.exports = new db.Schema({
    type: {
      type: String,
      enum: ['Point'],      
    },
    coordinates: {
      type: [Number],      
    }
  });
  