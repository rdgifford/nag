Array.prototype.every = function(callback) {
  var newarr = [];
  //take each element of array
  for (var i = 0; i < this.length; i++) {
    //call callback on each element and push result to newarr
    newarr.push(callback(this, i))
  }
  //return newarr
  return newarr
}
