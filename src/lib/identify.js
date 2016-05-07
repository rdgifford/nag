var fetchFirst = require('./fetchFirst.js')

//identify returns the first object that matchs search within a given dataPath
var identify = function(search, db, dataPath) {

  var entries;
  var isSearch = function(el, i, arr) {
    return search == el
  }

  entries = db.getData(dataPath)
  entries = Object.keys(entries)

  if (fetchFirst(entries, isSearch, undefined)) {
    return db.getData(dataPath + "/" + fetchFirst(entries, isSearch, undefined))
  } else {
    return null
  }
}

module.exports = identify
