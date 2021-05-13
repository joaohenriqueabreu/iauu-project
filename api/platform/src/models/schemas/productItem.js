const { Schema }        = require('mongoose')
const baseSchemaOptions = require('../schemas/options')

module.exports = new Schema({
    title: { type: String },
    description: { type: String },
}, baseSchemaOptions);