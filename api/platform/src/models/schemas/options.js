const hideSensitiveData = (doc, model, options) => {
  // Send id instead of _id
  model.id = model._id.toHexString();

  // Remove id and version
  delete model.__v; 
  delete model._id;  
}
 
module.exports = {
  timestamps: { createdAt: 'create_dt', updatedAt: 'update_dt' },
  toObject: { virtuals: true, transform: hideSensitiveData },
  toJSON: { virtuals: true, transform: hideSensitiveData }
}