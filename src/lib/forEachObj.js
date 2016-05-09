const jsonDB = require('node-json-db');
const db = new jsonDB("database.json", true, true);
const util = require('util');

// forEach object in JSON dbDir perform callback, overwriting as specified
var forEachObj = function(dbDir, overwrite, callback) {
  db.reload();
  var objects = db.getData(dbDir)
  var keyArr = Object.keys(objects)
  keyArr.forEach(function(key, i, arr) {
    var obj = objects[key]
    callback.call(undefined, key, obj, i, arr)
    db.push(dbDir + "/" + key, obj, overwrite)
  })
}

module.exports = forEachObj
