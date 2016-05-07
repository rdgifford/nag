'use strict'
const schedule = require('node-schedule')
const colors = require('colors');
const forEachObj = require('./lib/forEachObj.js')

class Reminder {
  //chore / interaction
  constructor(type, rule, route, db, dbDir, callback) {
    // if (type === "recurring" || type === "scheduled" || type === "readied") {
    //   type = type
    // } else {
    //   throw new Error("Reminder type can only be recurring, scheduled, or readied.")
    // }
    // if (type == "recurring") {
    //
    // }
    // if (type == "scheduled") {
    //
    // }
    // if (type == "readied") {
    //
    // }
    schedule.scheduleJob(rule, function() {
      callback.call(this)
    })
  }
}
module.exports = Reminder
