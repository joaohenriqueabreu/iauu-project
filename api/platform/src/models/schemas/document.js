const { Schema, model } = require('mongoose');
const baseSchemaOptions = require('./options');
const commentSchema     = require('./comment').schema;
const BaseRepository    = require('../repositories/base');

const documentSchema = new Schema({
    file_id:            { type: String, required: true },
    name:               { type: String },
    description:        { type: String },
    uploaded_by:        { type: String },
    approval:           {
      required:       { type: Boolean, default: false },
      approved:       { type: Boolean },
      reprove_reason: { type: String },
      comments:       [{ type: commentSchema }],
      approval_dt:    { type: Date },
    },
}, baseSchemaOptions);

class Document extends BaseRepository {
  get requires_approval() {
    return this.approval.required;
  }

  set requires_approval(value) {
    if (this.approval == null) { this.approval = {}}
    this.approval.required = value;
  }

  get status() {
    if (! this.requires_approval) { return 'open'; }
    if (this.approval.approved)   { return 'approved'; }
    if (!this.approval.approved)  { return 'reproved'; }
    return 'open';
  }

  get has_approval() {
    return this.requires_approval && typeof this.approval.approved === 'boolean'
  }

  get is_approved() {
    return this.requires_approval && this.approval.approved;
  }
}

documentSchema.loadClass(Document);
module.exports = model('Document', documentSchema);