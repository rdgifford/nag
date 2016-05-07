const Message = require('../../src/message.js')
const Action = require('../../src/action.js')
const Phone = require('../../src/phone.js')
const jsonDB = require('node-json-db');
const tmdb = new jsonDB("tmdatabase.json", true, true);
const tdb = new jsonDB("tdatabase.json", true, true);
const tdialog = new jsonDB("tdialog.json", true, true);
const testData = require('../lib/message/testData.js')
const parsed = require('../lib/message/parsed.js')
const pushed = require('../lib/message/pushed.js')
const ready = require('../../src/lib/ready.js')
const interpret = require('../../src/lib/interpret.js')
const deepExtend = require('../../src/lib/deepExtend.js')
const identify = require('../../src/lib/identify.js')
const route = require('../../src/lib/route.js')
const Chore = require('../../src/chore.js')
  // const Person = require('../../src/person.js')
  //this date isn't actually being used
var date = new Date()
var fs = require('fs');
var p = new Phone(parsed.From, "Robbie Gifford")
p.push(tdb)

date = date.toDateString().substring(4);

describe("lib", function() {
  describe("deepExtend", function() {
    var extendee = {
      person: {
        name: "Sam",
        age: 22,
        type: "Quiet"
      },
      family: "Sanderson"
    }
    var extender = {
      person: {
        name: "Daniel",
        age: 54,
        type: "Noisy",
        wealth: "Rich",
        null: null,
        obj: {},
        un: undefined,
        earray: []
      },
      family: "Slappy",
      hailsFrom: "Spain",
      null: null,
      obj: {},
      un: undefined,
      earray: []
    }
    deepExtend(extendee, extender)

    it("should add extender properties (and nested properties) to extendee", function () {
      expect(extendee.hailsFrom).toBe(extender.hailsFrom)
      expect(extendee.person.wealth).toBe(extender.person.wealth)
    });

    it("should not overwrite existing extendee properties (and nested properties)", function () {
      expect(extendee.family).toBe('Sanderson')
      expect(extendee.person.age).toBe(22)
    });

    it("should extend null, undefined, empty arrays, and empty objects (whether nested or not)", function () {
      expect(extendee.null).toBe(null)
      expect(extendee.person.null).toBe(null);
      expect(typeof extendee.obj).toBe('object');
      expect(typeof extendee.person.obj).toBe('object')
      expect(extendee.un).toBe(undefined);
      expect(extendee.person.un).toBe(undefined);
      expect(extendee.earray).toBe(extender.earray);
      expect(extendee.person.earray).toBe(extender.person.earray)
    });
  });

  describe("identify", function() {
    it("should return the name from the db associated with supplied number or null", function() {
      // var m = new Message(parsed.From, identify(parsed.From, tdb))
      var x = new Phone({
        From: "15035555555"
      }, "nobody")
      var t = tdb.getData("/phones/+15035777844")

      expect(identify(parsed.From, tdb, "/phones")).toBe(t)
      expect(identify("15035555555", tdb, "/phones")).toBe(null);
    });

    it("should return useable phoneData for interpret when paired with extend", function() {
      var id = identify(parsed.From, tdb, "/phones")
      id = deepExtend(id, Phone)
      expect(JSON.stringify(id)).toBe(JSON.stringify(p['+15035777844']));
    });
  });

  describe("interpret", function() {
    var mo = new Message(undefined, "Robert Gifford", "+15035777844", null)
    var p = new Phone(parsed.From, "Robbie Gifford")
    p = p["+15035777844"]
    mo.body = "nag"

    it("should not change message.directive if it already matches one on route", function() {
      var dir = "auto intro"
      var mox = new Message(undefined, "Robert Gifford", "+15035777844", dir)
      interpret(mox, p)
      expect(mox.directive).toBe(dir)
    });

    // it("should fetchFirst w/ message.body from route if phone.waiting is false and message.directive is null", function() {
    //   p.waiting = false
    //   interpret(mo, p)
    //   expect(mo.directive).toBe("nag");
    // });

    it("should assign message.directive default when directive is null and phoneData.dirlog is []", function() {
      var mi = new Message(parsed, "Robert Gifford")
      interpret(mi, p)
      expect(mi.directive).toBe("default")
    });

    it("should only stringMatch when phone.waiting is false", function() {
      p.waiting = true
      interpret(mo, p)
      expect(mo.directive).not.toBe(undefined || null);
    });

    it("should re-assign directive to last directive after an error", function () {
      var mi = new Message(parsed, undefined)
      mi.body = "Robert Gifford"
      p.waiting = true
      p.dirlog.unshift("auto intro reply error", "auto intro")
      interpret(mi, p)
    expect(mi.directive).toBe("auto intro reply")
    });
  });

  describe("ready", function() {
    it("should ready raw twilio data into usable message object", function() {
      expect(ready(testData).SmsMessageSid).toBe(parsed.SmsMessageSid)
    });
  });

  // describe("route", function () {
  //   it("should route to auto intro if message.Body doesn't exist and message.directive is auto intro", function () {
  //     var aim = new message(undefined, "+15035777844", "auto intro")
  //     spyOn(route, '')
  //   expect(route(aim)).toBe("auto intro");
  //   });
  //
  //   it("should route to response.help if message.Body is an unknown command", function () {
  //   expect().toBe();
  //   });
  //
  //   it("should route to response.command if message.Body is a command", function () {
  //   expect().toBe();
  //   });
  //
  //   describe("response.command", function () {
  //     it("should create a new phone object and perform phone.push if command is action", function () {
  //
  //     });
  //   });
  // });
});
describe("Phone", function() {
  var p = new Phone(parsed.From, "Robbie Gifford")
  describe("constructor", function() {
    it("should create an object under phones with the format number/{phone obj}", function() {
      expect(Object.keys(p)[0]).toBe("+15035777844")
    });
  });

  describe("push", function() {
    it("should add a new phone to the database", function() {
      //have to stringify because jasmine returns tags on objects that don't
      //appear in practical use.
      expect(JSON.stringify(tdb.getData("/phones"))).toBe(JSON.stringify(p));
    });

    it("should add a phone with queryable number", function() {
      expect(JSON.stringify(tdb.getData("/phones/+15035777844"))).toBe(JSON.stringify(p["+15035777844"]))
    });
  });
});
describe("Message", function() {
  var mi = new Message(parsed, "Robert Gifford")
  var mo = new Message(undefined, "Robert Gifford", "+15035777844", "auto intro", "chore", "Empty Dishwasher")
  mi.push(tmdb)
  mo.push(tmdb)
  var retrieved = tmdb.getData("/" + date)

  describe("constructor", function() {
    it("should create a message object with/without a twilioMessage for inbound/outbound messages", function() {
      expect(mi.direction).toBe("inbound");
      expect(mo.direction).toBe("outbound")
    });

    it("should assign arguments to proper parameters", function() {
      expect(mi.person).toBe("Robert Gifford");
      expect(mi.body).toBe(parsed.Body);
      expect(mi.msid).toBe(parsed.MessageSid);
      expect(mi.directive).toBe(null);
      expect(mo.person).toBe("Robert Gifford");
      expect(mo.directive).toBe("auto intro");
    });

    it("should assign command and data entry via message.body and parameters", function(){
      parsed.Body = "nag chore Takeout Trash"
      mx = new Message(parsed, 'Robert Gifford')
      expect(mx.command).toBe('chore')
      expect(mo.command).toBe('chore')
      expect(mx['data entry']).toBe('Takeout Trash')
      expect(mo['data entry']).toBe('Empty Dishwasher')
    })
  });

  describe("date", function() {
    it("should create a properly formatted date", function() {
      expect(mi.date()).toBe(date)
    });
  })

  describe("push", function() {
    it("should push parsed message to message database as /date/phone/[{obj}]", function() {
      expect(Object.keys(retrieved)[0]).toBe("+15035777844");
      expect(retrieved["+15035777844"][0].direction).toBe('inbound');
      expect(retrieved["+15035777844"][1].direction).toBe('outbound');
    });

    it("should push parsed message to message database without phone property (phone is identifier)", function() {
      expect(retrieved["+15035777844"][0].phone).toBe(undefined);
      expect(retrieved["+15035777844"][1].phone).toBe(undefined);
    });

    it("should push messages in an array", function() {
      mi.push(tmdb)
      var t = tmdb.getData("/" + date + "/" + parsed.From)

      expect(Array.isArray(t)).toBe(true);
    });
  });
});
describe("Action", function() {
  var mia = new Message(parsed, "Robert Gifford")
    // var moa = new Message(undefined, "Robert Gifford", "+15035777844", "auto intro")
    // var pna = new Person("Samuel", "5", "Clean everything")
  var pa = new Phone(parsed.From, "Robbie Gifford")
  pa = pa[parsed.From]
  interpret(mia, pa)
  var data = [mia, pa]
  var a = new Action(data, {
    waitingSwitch: false,
    returnMessage: false,
    setDirLog: false,
    dialogDb: tdialog,
    dialogPath: '/'
  })
  tdialog.push("/default", "Error", true)

  describe("constructor", function() {
    it("should take data, options, and callback", function() {
      expect(a.message).toBe(mia);
      expect(a.phoneData).toBe(pa);
      expect(a.options.returnMessage).toBe(false)
      expect(a.options.dialogDb).toBe(tdialog)
    });
  });

  describe("waitingSwitch", function() {
    it("should flip waiting to opposite whatever boolean it already is", function() {
      a.phoneData.waiting = true
      a.waitingSwitch()
      expect(a.phoneData.waiting).toBe(false)
    });
  });

  // describe("returnMessage", function() {
  //   it("should replace <<>> in string with specified arguments", function() {
  //     spyOn(a, "returnMessage").and.callThrough()
  //     a.message.directive = "reminder"
  //     tdialog.push("/reminder", "<<>>, I am your <<>>.", true)
  //     expect(a.returnMessage("Luke", "father")).toBe("Luke, I am your father.")
  //   });
  // });

  describe("setDirLog", function() {
    it("should take message.directive and unshift phone dirlog first array index to it", function() {
      a.message.directive = 'default'
      a.setDirLog()
      expect(pa.dirlog[0]).toBe("default")
    });

    // it("should take message.directive and set person lastdir", function() {
    //   var pn = new Person("Samuel", "5", "Clean everything")
    //   var mo = new Message(undefined, "Robert Gifford", "+15035777844", "reminder")
    //   a.setDirLog(mo, p, pn["Samuel"])
    //   expect(pn["Samuel"].lastdir).toBe("reminder");
    // });
  });

  describe("findDialog", function() {
    it("should return a dialog from the database", function() {
      expect(a.findDialog()).toBe("Error")
    });
  });
});
describe("Chore", function() {
  describe("constructor", function() {
    it("should create an object under chores with the format title/{chore obj} and default description and assignee to null", function() {
      var c = new Chore("Empty Dishwasher");
      expect(c["Empty Dishwasher"]["description"]).toBe(null);
      expect(c["Empty Dishwasher"]["assignee"]).toBe(null);
    });
  });
});
describe('cleanup', function() {
  it('should remove test file', function() {
    fs.unlinkSync("tmdatabase.json");
    fs.unlinkSync("tdatabase.json");
    fs.unlinkSync("tdialog.json")
  });
});
