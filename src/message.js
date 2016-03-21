'use strict'

class message {
  constructor(twilioMessage){
    if(twilioMessage){
      for (var x in twilioMessage) { this[x] = twilioMessage[x] }
    } else {
      //need to fill in else, maybe with an error
    }
  }

  //how will we get an array of just the phone numbers we've received messages from?
  //should we create a new object that strips phone numbers from the mobile db and stores them in an array, or should this just be a function?

  route(db) {
    //if(this.From == )
  }

  date(){
    var date = new Date()
    date = date.toDateString().substring(4)
    return date
  }

  //push parsed message in JSON database under data/from/[{obj}]
  push(db){
    var path = "/" + this.date() + "/" + this.From + "[]"
    //var localeCon = testData(locale) == undefined ? "\"" + locale + "[0]" + "\"" : "\"" + locale + "[]" + "\"";
    db.push(path, {SmsSid: this.SmsSid, Body: this.Body});
  }

  reply(twilioMessage) {
    client.messages.create({
      to: this.From,
      from: "+15038820432",
      body: this.route(this.Body),
    });
  }
}

module.exports = message
