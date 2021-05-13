const { Schema, model } = require('mongoose')
const mediaSchema       = require('./media')
const baseSchemaOptions = require('../schemas/options')

const productSchema = new Schema({
    name: 				{ type: String },
    description: 	{ type: String },
    photo:      	{ type: String },
    price:      	{ type: Number },
    duration:   	{ type: String },
    custom:     	{ type: Boolean, default: false },
    medias:     	[mediaSchema],
    items:      	[String]
}, baseSchemaOptions)
 
module.exports = model('Product', productSchema);