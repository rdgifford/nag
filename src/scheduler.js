//database must have two or more people

'use strict'
const postMessage = require('./lib/postMessage.js')
const Message = require('./message.js')
const schedule = require('node-schedule')
const route = require('./lib/route.js')
const forEachObj = require('./lib/forEachObj.js')
const Reminder = require('./reminder.js')
const colors = require('colors');


  var scheduler = function() {
  schedule.scheduleJob('/10 * * * * *', function() {
    forEachObj("/phones", true, function(key, obj, i, arr) {
      console.log(("AUTO INTRO SCHEDULER - obj.person: " + obj.person).trap)
      if (obj.person == null) {
        var mes = new Message(undefined, undefined, key, "auto intro")
        postMessage(mes)
        console.log(mes)
      } else {
        console.log(obj.person + " is in the database under mobile number " + key)
      }
    })
  })

  schedule.scheduleJob('0 /10 * * * *', function() {
    console.log('10')
    var fourHours = (60 * 60 * 1000) * 4
    var reminder = {
      'ready?': function(obj) {
        return obj.ready === true
      },
      ready: function(obj) {
        console.log('ready works!')
          //obj.schedule needs to be array
          //obj.usedSchedule needs to be empty array
      },
      'schedule?': function(obj) {
        return miniCron(obj.schedule) === miniCron(new Date)
      },
      schedule: function() {
        obj.usedSchedule.unshift(obj.schedule.shift())
      },
      'recur?': function() {
        //hour/day can't be non-specific here
        return miniCron(obj.recur) === miniCron(new Date)
      },
      recur: function() {
        console.log('recur')
      }
    }
    var miniCron = function(dateString) {
      dateString = dateString.toString()
      if (dateString.search(/\*/) !== -1) {
        var dArr = dateString.split(/ /)
        if (dArr.length < 2) {
          console.error('Improper dateString submitted for chore reminder.')
        } else {
          ndArr = miniCron(new Date).split(/ /)
            //map all asterisks to value of corresponding ndArr element
          dArr.map(function(el, i, arr) {
            arr[i] = el === '*' ? ndArr[i] : arr[i];
          })
          schedule = dArr.join(" ")
        }
      } else {
        var schedule = new Date(dateString)
        schedule = schedule.getHours() + " " + schedule.getDay()
      }
      return schedule
    }

    forEachObj("/chores", true, function(chore, obj, i, chores) {
      console.log(chore)
      var lastReminder = (new Date - new Date(obj.lastRem))
      if (lastReminder > fourHours && reminder[obj.reminderType + "?"](obj)) {
        reminder[obj.reminderType](obj);
        postMessage(new Message(null, undefined, obj.assignee, 'reminder', chore))
      } else {
        console.log("No chores to send reminders out for.")
      }
    })
  })
}

module.exports = scheduler
