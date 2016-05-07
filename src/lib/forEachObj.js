const jsonDB = require('node-json-db');
const db = new jsonDB("database.json", true, true);
const util = require('util');

var forEachObj = function(dbDir, overwrite, callback) {
  db.reload();
  var objects = db.getData(dbDir)
  console.log(("FOREACHOBJ - objects: " + util.inspect(objects, false, null)).rainbow)
  var keyArr = Object.keys(objects)
  keyArr.forEach(function(key, i, arr) {
    var obj = objects[key]
      //if callback exists do this
    callback.call(undefined, key, obj, i, arr)
      //last argument, true = overwrite, false = merge
    db.push(dbDir + "/" + key, obj, overwrite)
  })
}

module.exports = forEachObj
