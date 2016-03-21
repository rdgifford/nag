var message = require('../../src/message.js')
var mobile = require('../../src/mobile.js')
var jsonDB = require('node-json-db');
var tmdb = new jsonDB("tmdatabase.json", true, true);
var tdb = new jsonDB("tdatabase.json", true, true)
var testData = require('../lib/message/testData.js')
var parsed = require('../lib/message/parsed.js')
var pushed = require('../lib/message/pushed.js')
var ready = require('../../src/lib/ready.js')
var identify = require('../../src/lib/identify.js')

  //this date isn't actually being used
var date = new Date()
var fs = require('fs');

date = date.toDateString().substring(4);

describe("mobile", function () {
  m = new mobile(parsed, "Robbie Gifford")

  describe("constructor", function () {
    it("should create a new mobile object with a twilioMessage and name", function () {
    expect(m["+15035777844"].name).toBe("Robbie Gifford")
    expect(Object.keys(m)[0]).toBe("+15035777844")
    });
  });

  describe("push", function () {
    it("should add a new mobile to the database", function () {
      m.push(tdb)
    expect(tdb.getData("/mobile")).toBe(JSON.stringify(m));
    });
  });

  describe("find", function () {
    it("should return a person if given mobile number exists in database", function () {
      m.push(tdb)
    expect(m.find("+15035777844", tdb)).toBe(tdb.getData("/mobile"));
    });

    it("should return null if given mobile number does not exist in database", function () {
    expect(m.find(tdb)).toBe();
    });
  });
});

describe("message", function() {
  var testmessage = new message(parsed)

  describe("constructor", function () {
    it("should merge twilio message object properties to create message object", function () {
    expect(testmessage).not.toBeUndefined();
    });
  });

  describe("route", function () {
    it("should route to response.intro if message.From is unknown", function () {
    expect(testmessage.route()).toBe("Intro");
    });

    it("should route to response.help if message.Body is an unknown command", function () {
    expect().toBe();
    });

    it("should route to response.command if message.Body is a command", function () {
    expect().toBe();
    });

    describe("response.command", function () {
      it("should create a new mobile object and perform mobile.push if command is action", function () {

      });
    });
  });


  //date shouldn't be giving a properly formatted date here, why is it?
  describe("date", function() {
    it("should create a properly formatted date", function() {
    expect(testmessage.date()).toBe(date)
    });
  })

  describe("push", function () {
    it("should push parsed message to database under /date/from/[{obj}]", function () {
      testmessage.push(tmdb)
      testData = tmdb.getData("/" + date + "/" + parsed.From + "[0]")

    expect(JSON.stringify(testData)).toBe(pushed(parsed));
    });

    it("should push messages in an array", function () {
      testmessage.push(tmdb)
      testData = tmdb.getData("/" + date + "/" + parsed.From )

    expect(Array.isArray(testData)).toBe(true);
    });
  });

/*
  describe("ready", function () {
    it("should ready raw twilio data into usable message object", function () {
    expect(ready(testData).SmsMessageSid).toBe(parsed.SmsMessageSid)
    });
  });
*/
  describe("identify", function () {
    it("should set message.Sender to the result of mobile.find(sender, db)", function () {
      var x, m = new message(parsed);
      // mo = new mobile(parsed, "Robbie Gifford")
      //
      // mo.push(tdb)
    expect(identify(m, tdb)).toBe(tdb.getData("/mobile"))
    expect(identify(x, tdb)).toBe(null);
    });
  });

  describe('cleanup', function () {
      it('should remove test file', function () {
          fs.unlinkSync("tmdatabase.json");
          fs.unlinkSync("tdatabase.json");
      });
  });

});
