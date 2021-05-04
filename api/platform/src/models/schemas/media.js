// const db = require('../../data/db')
const db = require('mongoose')

module.exports = new db.Schema({    
    url: { type: String}        
});