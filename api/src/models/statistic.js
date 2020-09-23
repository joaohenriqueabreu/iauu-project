require('dotenv').config();
const db = require('mongoose');
const BaseModel = require('./base');
const baseSchemaOptions = require('./schemas/options');

const { Schema } = db;

const statisticSchema = new Schema({
  type: { type: String, enum: ['visit'], required: true },
  route: { type: String, required: true },
  ip: { type: String, required: true },
  metadata: {type: Object },
}, { ...baseSchemaOptions });

class Statistic extends BaseModel {
  constructor() {
    super();
  }
}

statisticSchema.loadClass(Statistic);
module.exports = db.model('Statistic', statisticSchema);
