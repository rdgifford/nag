const wrap = require('./wrap.js')
const fetchFirst = require('./fetchFirst.js')

var filterWrapIndex = function(searchIndex, searchArr, skipArr, exceptionArr) {
  // wrap around searchArr with searchIndex in case it is greater than or equal to searchArr.length
  searchIndex = wrap(searchIndex, searchArr)
  // wrap around searchArr with searchIndex + 1 and use it to pull an element from searchArr
  var nextSearchIndex = wrap(searchIndex + 1, searchArr)
  var nextSearch = searchArr[nextSearchIndex]
  // test if an element is the element specified in searchArr at searchIndex
  var isSearch = function(el, i, arr) {
    return searchArr[searchIndex] === el;
  }
  // fetch the first element matching search and assign to skip
  var skip = fetchFirst(skipArr, isSearch, undefined)
  // fetch the first element matching search and assign to exception
  var exception = fetchFirst(exceptionArr, isSearch, undefined)

  // if there isn't a skip or an exception
  if (!skip && !exception) {
    return searchIndex;
  // if there is a skip
  } else if (skip) {
    // remove the matching element from the skipArr
    skipArr.splice(skipArr.indexOf(searchIndex), 1)
    // and perform a recursive call with nextSearchIndex
    return filterWrapIndex.call(this, nextSearchIndex, searchArr, skipArr, exceptionArr)
  } else {
    // perform a recursive call with nextSearchIndex
    return filterWrapIndex.call(this, nextSearchIndex, searchArr, skipArr, exceptionArr)
  }
}

module.exports = filterWrapIndex
