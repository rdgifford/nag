var fetchFirst = require('./fetchFirst.js')

// fetchFirst el matching search from dataPath in specified JSON db
var identify = function(search, db, dataPath) {

  var entries;
  var isSearch = function(el, i, arr) {
    return search == el
  }

  entries = db.getData(dataPath)
  entries = Object.keys(entries)

  // if fetchFirst el matching search evaluates to true
  if (fetchFirst(entries, isSearch, undefined)) {
    // return it
    return db.getData(dataPath + "/" + fetchFirst(entries, isSearch, undefined))
  // if not
  } else {
    // return null
    return null
  }
}

module.exports = identify
