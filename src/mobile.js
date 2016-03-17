'use strict'

class mobile {
  constructor(twilioMessage, name, house, chores){
    var house = typeof house !== 'undefined' ? house : null;
    var chores = typeof chores !== 'undefined' ? chores : null;

    this[twilioMessage.From] = new person(name, house, chores)
    function person(name, house, chores){
      this.name = name
      this.house = house
      this.chores = chores
    }
  }

  push(db){
    // JSON.stringify({this.number: { "name": this.name, "house": null }})
    db.push("/mobile", JSON.stringify(this), true)
    // db.push("/people/" + this.number, this.name, true)
  }
  
  remove(){

  }

  find(){

  }
}

module.exports = mobile
