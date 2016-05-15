const querystring = require('querystring')
const request = require('request')
const config = require('../config.js')

// make post request to server with messageData, console.log result
function postMessage(messageData) {
  request.post({
    url: config.postURI,
    body: querystring.stringify(messageData)
  }, function(err, httpResponse, body) {
    if (err) {
      return console.error('post request failed:', err);
    }
    console.log('postMessage request successful with directive: ' + messageData.directive);
  });
}

module.exports = postMessage
