const http = require('http');
const querystring = require('querystring');
const url = require('url');
const message = require('./message.js')

var routes = {
  "/twilio": function() {
  }
}

var serv = http.createServer(function(req, res) {
  parsedURL = url.parse(req.url, true);
  resource = routes[parsedURL.pathname];
  if (resource) {
    res.writeHead(200)
    req.on('data', function (data) {
      m = new Buffer(data)
      m = querystring.parse(m.toString('utf8'))
      m = new message(data.ready)
      //rip the body from iMessage and
      m.log(mdb)
      m.reply(m.route)
    });
    res.end()
  } else {
    res.writeHead(404);
    res.end();
  }
});
serv.listen(3000)
