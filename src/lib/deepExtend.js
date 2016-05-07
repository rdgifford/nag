function deepExtend(extendee, extender) {
  //deepExtend is a pure function

  // //loop one fewer times than the number of arguments given
  // for(var i = 1; i < arguments.length; i++){
  //for each prop of argument i
  for (var prop in extender) {
    //if the type of prop is an object and does not equal null, call
    //deepExtend with the nested values of argument 0 and i
    if (extender[prop] && extender[prop].constructor === Object) {
      extendee[prop] = extendee[prop] || {};
      deepExtend(extendee[prop], extender[prop])
    } else {
      //and if argument i has a prop
      // if(extender.hasOwnprop(prop))
      //give it to argument 0
      // if(!extendee.hasOwnProperty(prop)){
      //   extendee[prop] = extender[prop]
      // } else {
      extendee[prop] = extendee.hasOwnProperty(prop) ?
        extendee[prop] : extender[prop];
      // }
    }
  }
  // }
  //return argument 0 with new properties
  return extendee;
}

module.exports = deepExtend
