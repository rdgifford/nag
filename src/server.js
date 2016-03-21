const jsonDB = require('node-json-db');
const db = new jsonDB("database", true, false);
const mdb = new jsonDB("mdatabase.json", true, false);
const http = require('http');
const url = require('url');
const message = require('./message.js')
const ready = require('./lib/ready.js')

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
      //create a new message object with readied data (data placed in a buffer, turned to a string, & parsed as a querystring)
      m = new message(ready(data))
      //if a mobile in db = message.From, add person attached to mobile to message as sender
      //else, add null to message as sender
      identify(m, db)
      //push message to mdb
      m.push(mdb)
      //reply to sender
      m.reply()
    });
    res.end()
  } else {
    res.writeHead(404);
    res.end();
  }
});
serv.listen(3000)
