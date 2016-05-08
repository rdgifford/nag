'use strict'

const priv = require('./private/private.js');
const identify = require('./lib/identify.js')
const jsonDB = require('node-json-db');
const db = new jsonDB("database.json", true, true);
const client = require('twilio')(priv.accountSid, priv.authToken);
const util = require('util');
const colors = require('colors');

var number;

class Message {
  constructor(messageData, person, phoneNumber, directive, dataEntry) {
    //if messageData is incoming from twilio, it will have SmsStatus 'received'
    if (messageData && messageData.SmsStatus === 'received') {
      this.direction = 'inbound'
      this.person = person
      number = messageData.From
      this.from = messageData.From
      this.body = messageData.Body
      this.msid = messageData.MessageSid
      this.directive = null
    //if messageData is outbound from an Action.postMessage post request, it
    //will have direction 'outbound'
    } else {
      console.log(("MESSAGEDATA for OUTBOUND: " + util.inspect(messageData, false, null)).yellow)
      this.direction = 'outbound'
      this.person = person || (messageData ? messageData.person : undefined);
      number = phoneNumber || (messageData ? messageData.to : null);
      this.to = phoneNumber || (messageData ? messageData.to || messageData.from : null);
      this.body = messageData ? messageData.body : null;
      this.directive = directive || (messageData ? messageData.directive : null);
      this['data entry'] = dataEntry || (messageData ? messageData['data entry'] : null);
    //otherwise create a new outbound message manually with submitted arguments
    //for errors / other places where custom directive created on the fly
    // } else {
    //   this.direction = 'outbound'
    //   this.person = person
    //   number = phoneNumber
    //   this.to = phoneNumber
    //   this.directive = directive
    //   this['data entry'] = dataEntry
    }

    //Message.body disection
    if(this.body !== undefined && this.body !== null){
    var bodyArr = this.body.split(" ")
    }

    if(bodyArr && (bodyArr[0] === "nag" || bodyArr[0] === "Nag")) {
      this.directive = bodyArr[1]
      var dataEntryIndex = this.body.match(bodyArr[1]).index + bodyArr[1].length + 1
      this['data entry'] = this.body.slice(dataEntryIndex)
    //these additional conditions aren't actually assigning this data to properties used by anything
    // } else if (command) {
    //   this.command = command
    //   this['data entry'] = dataEntry
    // } else {
    //   this.command = null
    //   this['data entry'] = null
    }
  }

  //how will we get an array of just the phone numbers we've received messages from?
  //should we create a new object that strips phone numbers from the mobile db and stores them in an array, or should this just be a function?

  date() {
    var date = new Date()
    date = date.toDateString().substring(4)
    return date
  }

  //push parsed message in JSON database under data/from/[{obj}]
  //we're trying to get
  push(db) {
    // delete this.phone
    //need to somehow prevent this.phone from latching onto object before it
    //gets pushed
    var path = "/" + this.date() + "/" + number + "[]"

    db.push(path, this, true);
  }

  send(body) {
    client.messages.create({
      to: this.from || this.to,
      from: "+15038820432",
      body: body
    });
  }
}

module.exports = Message
