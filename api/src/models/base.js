// const db = require('../data/db')
const db = require('mongoose')
const { forEach } = require('../seeds/social')

module.exports = class BaseModel {
  constructor(schema) {
    if (this.constructor === BaseModel) { throw new TypeError('Cannot construct abstract class') }        
  }

  static async fetchById(id, refs) {    
    const { error, model } = await this.findById({id})
    return this.handleQuery(error, model)
  } 
  
  static async fetch(condition) {    
    return this.find(condition, this.handleQuery)
  }

  static async fetchOne(condition, refs) {
    const result = this.findOne(condition)
    refs.forEach(ref => {
      result.populate(ref)
    })
    
    return result
  }

  static handleQuery(error, models) {
    if (error !== undefined && error !== null) {      
      throw new Error('Model not found')
    }

    return models
  }

  handleValidate(next) {
    console.log('we are handling')
    next()
  }

  handleSave(error, model, next) {
    console.log('it tried to save')
    next()
  }

  handleError(a, b, c, d) {
    console.log('ops')
    console.log(a)
    console.log(b)
    console.log(c)
    console.log(d)
  }

  static notFound(model) {
    if (model === undefined || model === null || model === [] || model.length === 0) {
      return true
    } 

    return model instanceof db.Types.ObjectId
  }

  assign(data) {
    if (data === undefined) { return; }
    for (const prop in data) {
      this[prop] = data[prop];
    }
  }
}