const wrap = require('./wrap.js')
const fetchFirst = require('./fetchFirst.js')

// filter searchArr with skipArr and exceptionArr by incrementally wrapping
// through searchArr, starting at searchIndex, and returning i of first non-matched el

// skipArr el are removed on match
// exceptionArr el are not removed on match
var filterWrapIndex = function(searchIndex, searchArr, skipArr, exceptionArr) {
  // wrap searchArr with searchIndex in case it is greater than or equal to searchArr.length
  searchIndex = wrap(searchIndex, searchArr)
  // wrap searchArr with searchIndex + 1 and use it to pull an element from searchArr
  var nextSearchIndex = wrap(searchIndex + 1, searchArr)
  var nextSearch = searchArr[nextSearchIndex]
  // test if el is el specified in searchArr at searchIndex
  var isSearch = function(el, i, arr) {
    return searchArr[searchIndex] === el;
  }
  // fetchFirst el from skipArr matching search, assign to skip
  var skip = fetchFirst(skipArr, isSearch, undefined)
  // fetchFirst el from exceptionAr matching search, assign to exception
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
