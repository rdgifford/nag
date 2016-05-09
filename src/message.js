'use strict'

const priv = require('./private.js');
const identify = require('./lib/identify.js')
const jsonDB = require('node-json-db');
const db = new jsonDB("database.json", true, true);
const client = require('twilio')(priv.accountSid, priv.authToken);
const util = require('util');
const colors = require('colors');

var number;

class Message {
  constructor(messageData, person, phoneNumber, directive, dataEntry) {
    var bodyArr;
    // if messageData is inbound from twilio, it will have SmsStatus 'received'
    if (messageData && messageData.SmsStatus === 'received') {
      console.log(("messageData inbound: " + util.inspect(messageData, false, null)).yellow)
      this.direction = 'inbound'
      this.person = person
      number = messageData.From
      this.from = messageData.From
      this.body = messageData.Body
      this.msid = messageData.MessageSid
      this.directive = null
    // if messageData is outbound from postMessage post request, it will have
    // direction 'outbound'
    } else {
      console.log(("messageData outbound: " + util.inspect(messageData, false, null)).yellow)
      this.direction = 'outbound'
      this.person = person || (messageData ? messageData.person : undefined);
      number = phoneNumber || (messageData ? messageData.to : null);
      this.to = phoneNumber || (messageData ? messageData.to || messageData.from : null);
      this.body = messageData ? messageData.body : null;
      this.directive = directive || (messageData ? messageData.directive : null);
      this.dataEntry = dataEntry || (messageData ? messageData.dataEntry : null);
    }

    // message.body disection for commands
    if(this.body !== undefined && this.body !== null){
      bodyArr = this.body.split(" ")
    }

    // if message.body begins with "Nag" or "nag", it is a command
    // parse commands into this.dataEntry and this.directive
    if(bodyArr && (bodyArr[0] === "nag" || bodyArr[0] === "Nag")) {
      this.directive = bodyArr[1]
      var dataEntryIndex = this.body.match(bodyArr[1]).index + bodyArr[1].length + 1
      this.dataEntry = this.body.slice(dataEntryIndex)
    }
  }

  date() {
    var date = new Date()
    date = date.toDateString().substring(4)
    return date
  }

  push(db) {
    var path = "/" + this.date() + "/" + number + "[]"

    db.push(path, this, true);
  }

  // send message via Twilio client
  send(body) {
    client.messages.create({
      to: this.from || this.to,
      from: priv.phoneNumber,
      body: body
    });
  }
}

module.exports = Message
