const { Schema, model } = require('mongoose');
const BaseRepository = require('./repositories/base');
const baseSchemaOptions = require('./schemas/options');

const statisticSchema = new Schema({
  type: { type: String, enum: ['visit'], required: true },
  route: { type: String, required: true },
  ip: { type: String, required: true },
  metadata: {type: Object },
}, { ...baseSchemaOptions });

class Statistic extends BaseRepository {
  constructor() {
    super();
  }
}

statisticSchema.loadClass(Statistic);
module.exports = model('Statistic', statisticSchema);
