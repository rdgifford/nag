const querystring = require('querystring');

var ready = function(data){
  var bdata = new Buffer(data)
  return querystring.parse(bdata.toString('utf8'))
}

module.exports = ready
