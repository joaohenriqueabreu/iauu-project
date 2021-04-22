'use strict'

const BaseController              = require('./base')
const SearchPublicScheduleService = require('../services/schedule/searchSchedule')
const SearchUserScheduleService   = require('../services/schedule/searchUserSchedule')
const SaveTimeslotService         = require('../services/schedule/saveTimeslot')
const DeleteTimeslotService       = require('../services/schedule/deleteTimeslot')

class ScheduleController extends BaseController {
  async publicSearch(req, res, next) {
    console.log('Requesting schedule...');
    const searchScheduleService = new SearchPublicScheduleService(req.data.id);
    try {
      await searchScheduleService.search(req.data);
      res.status(200).json(searchScheduleService.getSchedule());
    } catch (error) {
      next(error);
    }
  }
  
  async userSchedule(req, res, next) {
    console.log('Requesting private schedule...');
    const searchScheduleService = new SearchUserScheduleService(req.user.role_id);
    try {
      await searchScheduleService.search(req.data);
      res.status(200).json(searchScheduleService.getSchedule());
    } catch (error) {
      next(error);
    }
  }

  saveTimeslot(req, res, next) {
    console.log('Saving timeslot...')

    const saveTimeslotService = new SaveTimeslotService(req.user, req.data)
    saveTimeslotService.save(req.user, req.data)
      .then(() => { res.status(200).json(saveTimeslotService.getTimeslot()) })
      .catch((error) => next(error))
  }

  deleteTimeslot(req, res, next) {    
    console.log('Deleting timeslot...')

    const deleteTimeslotService = new DeleteTimeslotService(req.user, req.data)
    deleteTimeslotService.delete(req.user, req.data)
      .then(() => { res.status(200).json({}) })
      .catch((error) => next(error))
  }
}

module.exports = new ScheduleController()
