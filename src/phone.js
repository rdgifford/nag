'use strict'

class Phone {
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
}

module.exports = Phone
