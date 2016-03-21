var mobile = require('../mobile.js')

//identify has one more task to complete. if mobile is found we're good, otherwise we need
//to add the current mobile to db
//not true. we'll do this in the route. the action will be to construct a mobile with specified data
//we can then immediately push it after the user gives a valid name / confirmation.
var identify = function(message, db){
  var sender = message.From

  //assign the result of find called with sender of message and db
  message.Sender = find(sender, db);

  //return person from database with mobile = number, if no such person exists, return null
  function find(number, db){
    var mnums, result = null, mnumarr = [];
    mnums = db.getData("/mobile")
    mnums = Object.keys(mnums)

    if(findreturn(mnums)){
      return db.getData("/mobile/" + findreturn(mnums))
    }else{
      return null
    }

    function findreturn(arr) {
      var result = null;
      arr.some(function(el) {
        return number == el ? ((result = el), true) : false;
      });
      return result;
    }
  }
}

module.exports = identify
