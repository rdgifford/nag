'use strict'

const postMessage = require('./lib/postMessage.js')
const Message = require('./message.js')
const schedule = require('node-schedule')
const route = require('./lib/route.js')
const forEachObj = require('./lib/forEachObj.js')
const colors = require('colors');
const config = require('./config.js');

var scheduler = function() {
  // AUTO INTRO
  schedule.scheduleJob(config.autoIntroFreq, function() {
    // forEach phone in database if obj.person = null, send auto intro
    forEachObj("/phones", true, function(key, obj, i, arr) {
      if (obj.person == null) {
        var mes = new Message(undefined, undefined, key, "auto intro")
        postMessage(mes)
        console.log("SCHEDULER: auto intro sent to " + key + ".")
      } else {
        console.log("SCHEDULER: " + obj.person + " is in the database under mobile number " + key + ".")
      }
    })
  })

  // CHORE REMINDERS
  schedule.scheduleJob(config.choreReminderRefresh, function() {
    var reminderType = {
      'ready?': function(obj) {
        return obj.ready === true
      },
      ready: function(obj) {
      }
    }
    // forEach chore in the database send reminders
    forEachObj("/chores", true, function(chore, obj, i, chores) {
      console.log(chore)
      var lastReminder = (new Date - new Date(obj.lastRem))
      // if the last reminder sent was sent longer ago than choreReminderFreq
      // and the reminderType conditional passes
      if (lastReminder > config.choreReminderFreq && reminderType[obj.reminderType + "?"](obj)) {
        // call the reminderType function
        reminderType[obj.reminderType](obj);
        // and post a reminder for the chore assignee and console.log
        postMessage(new Message(null, undefined, obj.assignee, 'reminder', chore))
        console.log("SCHEDULER: chore reminder sent to " + obj.assignee + ".")
      } else {
        // otherwise console.log
        console.log("SCHEDULER: no chores to send reminders for.")
      }
    })
  })
}

module.exports = scheduler
