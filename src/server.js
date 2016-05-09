const jsonDB = require('node-json-db');
const db = new jsonDB("database.json", true, true);
const mdb = new jsonDB("mdatabase.json", true, true);
const http = require('http');
const url = require('url');
const Message = require('./message.js')
const ready = require('./lib/ready.js')
const extend = require('./lib/deepExtend.js')
const Phone = require('./phone.js')
const route = require('./lib/route.js')
const scheduler = require('./scheduler.js')
const identify = require('./lib/identify.js')
const interpret = require('./lib/interpret.js')
const util = require('util');

// URI for Twilio messageData / postMessage messageData
var routes = {
  "/messageData": function() {}
}

var serv = http.createServer(function(req, res) {
  parsedURL = url.parse(req.url, true);
  resource = routes[parsedURL.pathname];
  if (resource) {
    res.writeHead(200)
    req.on('data', function(data) {
      // create a messageData object from readied data (a querystring)
      var messageData = ready(data)
      console.log("New request with messageData:\n" + util.inspect(messageData, true, null))
      // return a phone from a phone number given as:
      // messageData.From (for inbound twiliomessage data) or messageData.to (for outbound postmessage data)
      var m = new Message(messageData)
      var p = identify((messageData.From || messageData.to), db, "/phones")
      var c = db.getData("/chores")
      var data = [m, p, c]

      // extend JSON data with a Phone
      p = extend(p, Phone)

      // assign message a directive if one doesn't exist
      interpret(m, p)
      console.log("Directive for routing after interpret: " + m.directive)

      // route message according to its directive with data
      route[m.directive](data)

      // push data to database
      if (p !== null) {
        db.push("/phones/" + (messageData.From || messageData.to), p, true)
      }
      if (c !== null) {
        db.push("/chores/", c, true)
      }
      m.push(mdb)
    });
    res.end()
  } else {
    res.writeHead(404);
    console.log('Error: 404')
    res.end();
  }
});
serv.listen(3000)
console.log('Server running at localhost:3000');

// scheduler (chore reminders and auto intro)
scheduler();
