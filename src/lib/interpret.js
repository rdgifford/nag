const fetchFirst = require('./fetchFirst.js')
const route = require('./route.js')

//Assign message a directive if one doesn't exist
var interpret = function(message, phoneData) {
  var routes = Object.keys(route)
  var isError = (/error$/)
  var lastDir = phoneData.dirlog[0]
  var dirBeforeErr = null
  var matchedDir = fetchFirst(routes, strMatchDir, undefined)
  var matchedBody = fetchFirst(routes, strMatchBody, undefined)
  var match = (matchedDir || matchedBody)

  //Inbound messages
  function strMatchBody(el, i, arr) {
    return message.body == el
  }
  //Outbound messages
  function strMatchDir(el, i, arr) {
    return message.directive == el
  }
  //Retrieve last non-error
  function lastNonError(el, i, arr) {
    return !isError.test(el)
  }

  //If the last directive isn't undefined or an error, and message is inbound,
  if (lastDir !== undefined && isError.test(lastDir) && message.direction === 'inbound') {
    //assign the last non-error directive to a variable.
    dirBeforeErr = fetchFirst(phoneData.dirlog, lastNonError, undefined)
  }

  //If the message directive or body match any of routes,
  if (match) {
    //assign directive to that match.
    message.directive = match;
  //If there is no match,
  } else {
    //provided the sender is waiting for a reply, reply to the last non-error directive.
    message.directive = (phoneData.waiting !== false) ? (dirBeforeErr || lastDir) + ' reply' : 'default';
  }
}

module.exports = interpret
