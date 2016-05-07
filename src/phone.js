'use strict'

class Phone {
  //I think instead of message this should be number, then the object is deconstructing
  //another object to create itself, instead it's just pluging in literals
  constructor(number, person, waiting, dirlog){
    var person = typeof person !== 'undefined' ? person : null;
    var waiting = typeof waiting !== 'undefined' ? waiting : false;
    var dirlog = typeof dirlog !== 'undefined' ? dirlog : [];

    this[number] = new data(person, waiting, dirlog)
    function data(){
      this.person = person
      this.waiting = waiting
      this.dirlog = dirlog
    }
  }

  push(db){
    db.push("/phones", this, false)
  }

  test(mes){
    return mes
  }
  // retrieve(db){
  //   db.getData("/mobile/")
  // }

  // remove(){
  //
  // }
}

module.exports = Phone
