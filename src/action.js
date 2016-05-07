'use strict'
const Chore = require('./chore.js')
const Phone = require('./phone.js')
const jsonDB = require('node-json-db');
const db = new jsonDB("database", true, true);
const dialog = new jsonDB("dialog.json", true, true);
const deepExtend = require('./lib/deepExtend.js');
const util = require('util')
const colors = require('colors');

class Action {
  //[data] = [message, phoneData, personData]
  //[options] = [waitingSwitch, returnMessage, setDirLog, dialogDb, dialogPath]
  //defaults to true
  constructor(data, options) {
    //DATA
    this.message = data[0]
    this.phoneData = data[1]
    this.chores = data[2]
    // this.personData = data[2]
    //OPTIONS
    this.options = options === undefined ? {} : options;
    this.defaultOptions = {
      waitingSwitch: true,
      returnMessage: null,
      setDirLog: true,
      dialogDb: dialog,
      dialogPath: "/"
    }

    deepExtend(this.options, this.defaultOptions)
      // for (var option in this.options) {
      //   option = typeof option !== null ? option : this.defaultOptions[option];
      // }
      // this.validation(errSetter, this.options)
  }

  enactOptions() {
    var o = this.options
    if (o.waitingSwitch == true)
      this.waitingSwitch()
    if (o.returnMessage == true)
      console.log(o.returnMessage)
    this.returnMessage(o.returnMessage);
    if (o.setDirLog == true)
      this.setDirLog()
  }

  waitingSwitch() {
    this.phoneData.waiting = this.phoneData.waiting === true ? false : true;
  }

  //optionalInsertions is an array that should return all the insertions for return message
  returnMessage(optionalInsertions) {
    var d = this.findDialog()
    var arr = typeof optionalInsertions === 'function' ? optionalInsertions.call(this) : null;
    //take all arguments after dataPath and replace them each individually into string for <<>>
    if (arr != null && arr.length > 0)
      for (var i = 0; i <= arr.length; i++) {
        d = d.replace("<<>>", arr[i])
      }
      // return d
      console.log(("Message returned with dialog: " + d).green)
    this.message.send(d)
  }

  setDirLog() {
    (this.phoneData.dirlog).unshift(this.message.directive);
    //getting rid of person
    //person info to phone
    // personData.lastdir = message.directive;
  }

  findDialog() {
    var opt = this.options
    console.log("findDialog this.message: " + this.message)
    return opt.dialogDb.getData(opt.dialogPath + this.message.directive)
  }
}
module.exports = Action
