const { Schema }        = require('mongoose')
const baseSchemaOptions = require('../schemas/options')

module.exports = new Schema({    
    bg: { type: String },
    photo: { type: String }
}, baseSchemaOptions);