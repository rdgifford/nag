const fetchFirst = require('./fetchFirst.js')
const route = require('./route.js')

// assign message directive if one doesn't exist
var interpret = function(message, phoneData) {
  var routes = Object.keys(route)
  var isError = (/error$/)
  var lastDir = phoneData.dirlog[0]
  var dirBeforeErr = null
  var matchedDir = fetchFirst(routes, strMatchDir, undefined)
  var matchedBody = fetchFirst(routes, strMatchBody, undefined)
  var match = (matchedDir || matchedBody)

  // inbound messages
  function strMatchBody(el, i, arr) {
    return message.body == el
  }
  // outbound messages
  function strMatchDir(el, i, arr) {
    return message.directive == el
  }
  // retrieve last non-error
  function lastNonError(el, i, arr) {
    return !isError.test(el)
  }

  // if lastDir isn't undefined or error and message is inbound,
  if (lastDir !== undefined && isError.test(lastDir) && message.direction === 'inbound') {
    // assign the last non-error directive to a variable
    dirBeforeErr = fetchFirst(phoneData.dirlog, lastNonError, undefined)
  }

  // if message directive or body match any of routes,
  if (match) {
    // assign directive to match
    message.directive = match;
  // if no match,
  } else {
    // provided sender waiting, reply to last non-error directive
    message.directive = (phoneData.waiting !== false) ? (dirBeforeErr || lastDir) + ' reply' : 'default';
  }
}

module.exports = interpret
