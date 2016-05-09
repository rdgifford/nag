// return index modulo array length to step through array length
var wrap = function(index, arr){
  var wrappedIndex = index % arr.length
  return wrappedIndex
}

module.exports = wrap
