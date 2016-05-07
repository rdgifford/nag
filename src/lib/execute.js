const Action = require('../Action.js')
const util = require('util')
const postMessage = require('./postMessage.js');
const Message = require('../message.js')

//Execute an action and passingCallback if condition type-converts to true.
function execute(data, condition, passingCallback, options) {
  var a = new Action(data, options)

  //Default options to an empty object.
  options = options !== undefined ? options : {}

  console.log("Message for execute: " + util.inspect(a.message, false, null))
  //If condition is a function, call it.
  if (typeof condition !== 'function' ? condition : condition.call(a)) {
    console.log(("EXECUTE message after conditional: " + util.inspect(a.message, false, null)).yellow)
    //Call passingCallback
    passingCallback !== undefined && passingCallback !== null ? passingCallback.call(a) : null;
    a.enactOptions()
  } else {
    // a.reportError();
    console.log('User generated error from route ' + a.message.directive + ".",
      "Supplied data: " + util.inspect(a.message, false, null) + " " + util.inspect(a.phoneData, false, null) + " " + ", options: " + util.inspect(a.options, false, null) + ".");
    var mes = new Message(a.message, undefined, null, a.message.directive + " error")
    delete mes.body
    postMessage(mes)
  }
}

module.exports = execute
