'use strict'
// constructor for chores
class Chore {
  constructor(title, description, assignee){
    var description = typeof description !== 'undefined' ? description : null;
    var assignee = typeof assignee !== 'undefined' ? assignee : null;

    this[title] = new data(description, assignee)
    function data(description, assignee){
      this.description = description;
      this.assignee = assignee
      this.lastRem = null
    }
  }

  push(){
    db.push("/chores", this, false)
  }
}

module.exports = Chore
