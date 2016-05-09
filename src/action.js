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
  //[options] = [waiting, returnMessage, setDirLog, dialogDb, dialogPath]
  constructor(data, options) {
    //DATA
    this.message = data[0]
    this.phoneData = data[1]
    this.chores = data[2]

    //OPTIONS
    this.options = options === undefined ? {} : options;
    this.defaultOptions = {
      waiting: false,
      returnMessage: true,
      setDirLog: true,
      dialogDb: dialog,
      dialogPath: "/"
    }
    // default any unassigned options
    deepExtend(this.options, this.defaultOptions)
  }

  enactOptions() {
    var o = this.options
    this.waiting()
    if (o.returnMessage == true)
      console.log(o.returnMessage)
    this.returnMessage(o.returnMessage);
    if (o.setDirLog == true)
      this.setDirLog()
  }

  waiting() {
    this.phoneData.waiting = this.options.waiting === true ? true : false;
    console.log('phoneData.waiting: ' + this.phoneData.waiting)

  }

  // takes true, false, or array
  // if true/false, sends/doesn't message
  // if array, replaces '<<>>' in dialog with elements in order provided in array
  returnMessage(optionalInsertions) {
    var d = this.findDialog()
    var arr = typeof optionalInsertions === 'function' ? optionalInsertions.call(this) : null;
    // take all arguments after dataPath and replace them each individually into string for <<>>
    if (arr != null && arr.length > 0)
      for (var i = 0; i <= arr.length; i++) {
        d = d.replace("<<>>", arr[i])
      }
    if(optionalInsertions == true || typeof optionalInsertions === 'function'){
      console.log(("Message returned with dialog: " + d).green)
      this.message.send(d)
    } else {
      console.log(("Message not returned, optionalInsertions evaluated to false.").red)
    }
  }

  // set dirLog on phoneData
  setDirLog() {
    (this.phoneData.dirlog).unshift(this.message.directive);
  }

  // retrieve dialog with prop name matching this.message.directive
  findDialog() {
    var opt = this.options
    return opt.dialogDb.getData(opt.dialogPath + this.message.directive)
  }
}
module.exports = Action
