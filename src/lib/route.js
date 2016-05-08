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
  /*
  exec(data, condition, passingCallback, options)
  data = [message, phoneData, chores]
  condition = function(){}
  passingCallback = function(){}
  options (w/ defaults) = {
    waitingSwitch: true,
    returnMessage: true,
    setDirLog: true,
    dialogDb: dialog,
    dialogPath: null
  }
  */

var route = {
  //INTRODUCTIONS
  "auto intro": function(data) {
    exec(data, true)
  },
  "auto intro reply": function(data) {
    exec(data,
      function() {
        //RegExp matcher for one word, one space, and one more word
        var isName = (/^[a-z'-]+[ ][a-z'-]+$/i)
        //Test if the message body matchs isName RegExp
        return isName.test(this.message.body)
      },
      function() {
        //Set a persons name
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
    exec(data, true, null, {
      waitingSwitch: false
    })
  },
  //COMMANDS
  //Require message.body format = "nag <<command>> <<data entry>>"
  "reminder": function(data) {
    exec(data, true,
      function() {
        var fourHours = 60 * 60 * 1000 * 4
        this.chore = this.chores[this.message['data entry']]
        //Set lastRem to current date
        if(((new Date) - this.chore.lastRem < fourHours) || (this.chore.lastRem instanceof Date === false)){
          this.chore.lastRem = new Date().toString()
        }
      },
      {
        waitingSwitch: false,
        returnMessage: function(){
          return [this.message['data entry']]
        }
      }
    )
  },
  "chore": function(data) {
    exec(data,
      function() {
        //Set this.chore equal to the message body data entry specified (as an object).
        this.chore = this.chores[this.message['data entry']]
        return this.chore !== undefined && this.chore !== null
      },
      function() {
        // console.log("THIS.CHORE: " + util.inspect(this.chore, false, null))
        // console.log("THIS.PHONEDATA in ROUTE.CHORE: " + util.inspect(this.phoneData, false, null))
        //If four hours have passed since the last reminder of this.chore, send another
        //Create a post reminder
        var reminder = new Message(null, undefined, this.chore.assignee, "reminder", this.message['data entry'])
        // postMessage(reminder)
        postMessage(reminder)
        if (this.chore.reminderType === 'ready' && this.chore.ready === false) {
          this.chore.ready = true
        }
      }, {
        waitingSwitch: false,
        returnMessage: function() {
          return [this.message['data entry']]
        }
      }
    )
  },
  "chore error": function(data) {
    exec(data, true, null, {
      waitingSwitch: false,
      returnMessage: function() {
        return [Object.keys(this.chores)]
      }
    })
  },
  "done": function(data){
    exec(data,
      function() {
        //Set this.chore equal to the message body data entry specified (as an object).
        this.chore = this.chores[this.message['data entry']]
        return this.chore && this.chore.assignee === this.message.from && this.chore.ready
      },
      function(){
        var phoneNumbers = Object.keys(db.getData("/phones"))
        var nextIndex = phoneNumbers.indexOf(this.chore.assignee) + 1
        var nextAssigneeIndex = filterWrapIndex(nextIndex, phoneNumbers, this.chore.skips, this.chore.exceptions)
        if (nextAssigneeIndex < phoneNumbers.length && nextAssigneeIndex >= 0) {
          this.chore.assignee = phoneNumbers[nextAssigneeIndex]
          this.chore.ready = false
        } else {
          console.error(("Error in route.done: nextAssignee evaluted to false.").red)
        }
      }, {
        waitingSwitch: false,
        returnMessage: function() {
          return [this.message['data entry']]
        }
      }
    )
  },
  "done error": function(data) {
    exec(data, true, null, {
      waitingSwitch: false,
      returnMessage: function() {
        return [Object.keys(this.chores)]
      }
    })
  },
  "skip": function(data) {
    exec(data,
      function() {
        //Set this.chore equal to the message body data entry specified (as an object).
        this.chore = this.chores[this.message['data entry']]
        return this.chore && this.phoneData.skips
      },
      function(){
        var phoneNumbers = Object.keys(db.getData("/phones"))
        var nextIndex = phoneNumbers.indexOf(this.chore.assignee) + 1
        var nextAssigneeIndex = filterWrapIndex(nextIndex, phoneNumbers, this.chore.skips, this.chore.exceptions)
        var isValidIndex = (nextAssigneeIndex < phoneNumbers.length && nextAssigneeIndex >= 0)
        var isSkipped = fetchFirst(this.chore.skips, function(el, i){
          this.message.from === el
        }, this)

        // If sender is assigned to chore, move them off, assign the next person to the chore, and take one of their skips
        if (!isValidIndex) {
          console.error(("Error in route.skip: nextAssignee evaluted to false.").red)
        } else if (this.message.from === this.chore.assignee) {
          this.chore.assignee = phoneNumbers[nextAssigneeIndex]
          this.phoneData.skips--
        } else {
          // if sender is not chore.assignee and not already in skips, add it
          // to skips and decrement sender.skips
          isSkipped || (this.chore.skips.push(this.message.from), this.phoneData.skips--)
        }
        var reminder = new Message(null, undefined, this.chore.assignee, "reminder", this.message['data entry'])
        postMessage(reminder)
      }, {
        waitingSwitch: false,
        returnMessage: function() {
          return [this.message['data entry'], this.phoneData.skips]
        }
      }
    )
  },
  "skip error": function(data){
    exec(data, true, null, {
      waitingSwitch: false,
      returnMessage: function(){
        return [this.phoneData.skips, Object.keys(this.chores)]
      }
    })
  },
  // "see": function(data) {
  //   //validate and show dataPath
  // },
  "default": function(data) {
    exec(data, true, null, {
      waitingSwitch: false
    })
  }
}

module.exports = route
