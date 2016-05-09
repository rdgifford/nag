// deepExtend extends all properties, including nested ones, and extends them
// from extender to extendee.
function deepExtend(extendee, extender) {
  // for each prop of extender
  for (var prop in extender) {
    // if extender property evaluates to true and extender property is an object
    // in short, if extender prop is a nested object
    if (extender[prop] && extender[prop].constructor === Object) {
      // set extender property to extendee, or an empty object (if extender
      // property evaluates to false)
      extendee[prop] = extendee[prop] || {};
      // recursively call deepExtend on the nested objects within extender / extendee
      deepExtend(extendee[prop], extender[prop])
    } else {
      // set extendee prop to extendee prop if extendee has prop, otherwise set
      // it to extender prop
      extendee[prop] = extendee.hasOwnProperty(prop) ? extendee[prop] : extender[prop];
    }
  }
  return extendee;
}

module.exports = deepExtend
