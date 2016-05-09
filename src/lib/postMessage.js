const querystring = require('querystring')
const request = require('request')
const priv = require('../private.js')

// make post request to server with messageData, console.log result
function postMessage(messageData) {
  request.post({
    url: priv.postURI,
    body: querystring.stringify(messageData)
  }, function(err, httpResponse, body) {
    if (err) {
      return console.error('post request failed:', err);
    }
    console.log('postMessage request successful with directive: ' + messageData.directive);
  });
}

module.exports = postMessage
