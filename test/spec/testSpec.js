var message = require('../../src/message.js')
var mobile = require('../../src/mobile.js')
var jsonDB = require('node-json-db');
var tmdb = new jsonDB("tmdatabase.json", true, true);
var tdb = new jsonDB("tdatabase.json", true, true)
var parsedMessage = require('../lib/message/parsed.js')
var logged = require('../lib/message/logged.js')
  //this date isn't actually being used
var date = new Date()
var fs = require('fs');

date = date.toDateString().substring(4);

describe("mobile", function () {
  m = new mobile(parsedMessage, "Robbie Gifford")

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
    it("should return a person if given a mobile number that exists in database", function () {
      mobile.find(tdb)
    expect().toBe();
    });
  });
});

describe("message", function() {
  var testmessage = new message(parsedMessage)

  describe("constructor", function () {
    it("should merge twilio message object with message", function () {
    expect(testmessage).not.toBeUndefined();
    });
  });

  describe("route", function () {
    it("should force intro if message.From is unknown", function () {
    expect(testmessage.route()).toBe("Intro");
    });
  });


  //date shouldn't be giving a properly formatted date here, why is it?
  describe("date", function() {
    it("should create a properly formatted date", function() {
    expect(testmessage.date()).toBe(date)
    });
  })

  describe("log", function () {
    it("should log parsed message to database under /date/from/[{obj}]", function () {
      testmessage.log(tmdb)
      testData = tmdb.getData("/" + date + "/" + parsedMessage.From + "[0]")

    expect(JSON.stringify(testData)).toBe(logged(parsedMessage));
    });

    it("should log messages in an array", function () {
      testmessage.log(tmdb)
      testData = tmdb.getData("/" + date + "/" + parsedMessage.From )

    expect(Array.isArray(testData)).toBe(true);
    });
  });

  describe('cleanup', function () {
      it('should remove test file', function () {
          fs.unlinkSync("tmdatabase.json");
          fs.unlinkSync("tdatabase.json");
      });
  });

});
