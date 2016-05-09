const querystring = require('querystring');

// turn raw querystring data to utf8 encoded string
var ready = function(data){
  var bdata = new Buffer(data)
  return querystring.parse(bdata.toString('utf8'))
}

module.exports = ready
