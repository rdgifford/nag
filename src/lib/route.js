const jsonDB = require('node-json-db');
const dialog = new jsonDB("dialog.json", true, true);
const db = new jsonDB("database.json", true, true);
const action = require('./../action.js');
const exec = require('./execute.js');
const Chore = require('../chore.js');
const identify = require('./identify.js');
const fetchFirst = require('./fetchFirst.js');
const util = require('util');
const colors = require('colors');
const Message = require('../message.js')
const filterWrapIndex = require('./filterWrapIndex.js')
const postMessage = require('./postMessage.js')
const config = require('../config.js')
  /*
  exec(data, condition, passingCallback, options)
  data = [message, phoneData, chores]
  condition = function(){}
  passingCallback = function(){}
  options (w/ defaults and use) = {
    waiting: false,
      Boolean: sets phoneData.waiting if "reply" is desired
    returnMessage: true,
      Boolean: sets whether automatic message sent
      or
      Array: replaces '<<>>' in dialog matching route.prop name in order supplied
      and sends message
    setDirLog: true,
      Boolean: sets whether route records dir in phoneData.dirLog
    dialogDb: dialog,
      Var: sets location of dialog JSON db
    dialogPath: null
      String: sets dirPath withing dialog JSON db
  }
  */

var route = {
  //INTRODUCTIONS
  "auto intro": function(data) {
    exec(data, true, null, { waiting: true })
  },
  "auto intro reply": function(data) {
    exec(data,
      function() {
        // regExp matcher for one word, one space, and one more word
        var isName = (/^[a-z'-]+[ ][a-z'-]+$/i)
        // test if message body matchs isName regExp
        return isName.test(this.message.body)
      },
      function() {
        // set a name on phoneData
        this.phoneData.person = this.message.body
        this.message.person = this.message.body
      }, {
        returnMessage: function() {
          var name = this.message.body
          return [name.slice(0, name.match(/ /).index)]
        }
      }
    )
  },
  "auto intro reply error": function(data) {
    exec(data, true, null, { waiting: true })
  },
  //COMMANDS
  // require message.body format = "nag <<command>> <<data entry>>"
  "reminder": function(data) {
    exec(data, true,
      function() {
        this.chore = this.chores[this.message.dataEntry]
        // set lastRem to current dateString if lastRem less than config.choreReminderFreq ago or lastRem is not a Date
        if(((new Date) - this.chore.lastRem < config.choreReminderFreq) || (this.chore.lastRem instanceof Date === false)){
          this.chore.lastRem = new Date().toString()
        }
      },
      { returnMessage: function(){ return [this.message.dataEntry] } }
    )
  },
  "chore": function(data) {
    exec(data,
      function() {
        // set this.chore equal to data entry parsed from message body
        this.chore = this.chores[this.message.dataEntry]
        // condition: if this.chore is valid chore
        return this.chore !== undefined && this.chore !== null
      },
      function() {
        var reminder = new Message(null, undefined, this.chore.assignee, "reminder", this.message.dataEntry)
        // send reminder to chore assignee of this.chore
        postMessage(reminder)
        // if reminderType of this.chore is ready and it isn't ready,
        if (this.chore.reminderType === 'ready' && this.chore.ready === false) {
          // ready it
          this.chore.ready = true
        }
      }, {
        returnMessage: function() {
          return [this.message.dataEntry]
        }
      }
    )
  },
  "chore error": function(data) {
    exec(data, true, null, {
      returnMessage: function() {
        return [Object.keys(this.chores)]
      }
    })
  },
  "done": function(data){
    exec(data,
      function() {
        // set this.chore equal to data entry parsed from message body
        this.chore = this.chores[this.message.dataEntry]
        // condition: if this.chore evaluates to true, sender is this.chore.assignee,
        // and this.chore is readied
        return this.chore && this.chore.assignee === this.message.from && this.chore.ready
      },
      function(){
        // set var for phone numbers in db
        var phoneNumbers = Object.keys(db.getData("/phones"))
        // set var for index of this.chore.assignee + 1
        var nextIndex = phoneNumbers.indexOf(this.chore.assignee) + 1
        // set var for nextAssigneeIndex from filtering phoneNumbers with
        // this.chore.skips and this.chore.exceptions
        var nextAssigneeIndex = filterWrapIndex(nextIndex, phoneNumbers, this.chore.skips, this.chore.exceptions)
        // valid index must be greater than or equal to zero and less than length
        // of phoneNumbers array
        var isValidIndex = (nextAssigneeIndex < phoneNumbers.length && nextAssigneeIndex >= 0)

        if (!isValidIndex) {
          console.error(("Error in route.done: nextAssignee evaluted to false.").red)
        } else {
          // set this.chore.assignee to next assignee
          this.chore.assignee = phoneNumbers[nextAssigneeIndex]
          // unready the chore
          this.chore.ready = false
        }
      }, {
        returnMessage: function() {
          return [this.message.dataEntry]
        }
      }
    )
  },
  "done error": function(data) {
    exec(data, true, null, {
      returnMessage: function() {
        return [Object.keys(this.chores)]
      }
    })
  },
  "skip": function(data) {
    exec(data,
      function() {
        this.chore = this.chores[this.message.dataEntry]
        // condition: if this.chore evaluates to true and this.phoneData.skips
        // is not 0
        return this.chore && this.phoneData.skips
      },
      function(){
        var phoneNumbers = Object.keys(db.getData("/phones"))
        var nextIndex = phoneNumbers.indexOf(this.chore.assignee) + 1
        var nextAssigneeIndex = filterWrapIndex(nextIndex, phoneNumbers, this.chore.skips, this.chore.exceptions)
        var isValidIndex = (nextAssigneeIndex < phoneNumbers.length && nextAssigneeIndex >= 0)
        // set var isSkipped to the result of fetching the first match of the
        // senders phone number with this.chore.skips array
        var isSkipped = fetchFirst(this.chore.skips, function(el, i){
          this.message.from === el
        }, this)

        if (!isValidIndex) {
          console.error(("Error in route.skip: nextAssignee evaluted to false.").red)
          // if sender is assigned to chore, assign nextAssignee
        } else if (this.message.from === this.chore.assignee) {
          this.chore.assignee = phoneNumbers[nextAssigneeIndex]
          // decrement senders skips
          this.phoneData.skips--
        } else {
          // if sender phone number not this.chore.assignee and isn't already in skips,
          // push sender phone number to this.chore.skips and decrement senders skips
          isSkipped || (this.chore.skips.push(this.message.from), this.phoneData.skips--)
        }
        // send reminder
        var reminder = new Message(null, undefined, this.chore.assignee, "reminder", this.message.dataEntry)
        postMessage(reminder)
      }, {
        returnMessage: function() {
          return [this.message.dataEntry, this.phoneData.skips]
        }
      }
    )
  },
  "skip error": function(data){
    exec(data, true, null, {
      returnMessage: function(){
        return [this.phoneData.skips, Object.keys(this.chores)]
      }
    })
  },
  "default": function(data) {
    exec(data, true, null)
  }
}

module.exports = route
