const wrap = require('./wrap.js')
const fetchFirst = require('./fetchFirst.js')

var filteredWrapSearch = function(search, searchArr, skipArr, exceptionArr) {
  var searchIndex = searchArr.indexOf(search)
  console.log(search)
  var nextSearch = searchArr[wrap(searchIndex + 1, searchArr)]
  console.log("Next search is: " + nextSearch)
  var isSearch = function(el, i, arr) {
    return search === el;
  }
  var skip = fetchFirst(skipArr, isSearch, undefined)
  var exception = fetchFirst(exceptionArr, isSearch, undefined)
  //If exceptionArr is empty set exception to false, otherwise test that everyvalue is search
  // var exception = exceptionArr.length === 0 ? false : ;
  console.log("Skip: " + skip)
  // console.log("Exception: " + exception)
  // var exceptions = exceptionArr !== [] ?  : false;
  // console.log(exceptions)
  // If search is not in searchArr, report an error
  if (searchIndex === -1){
    console.error(("Search is not in searchArr.").red)
  } else if (!skip && !exception) {
    console.log("BANANAS beforehand: " + search);
    return search;
    // If search is in skipArr, remove it from skipArr and recursively call filteredWrapSearch
  } else if (skip) {
    skipArr.splice(skipArr.indexOf(search), 1)
    return filteredWrapSearch.call(this, nextSearch, searchArr, skipArr, exceptionArr)
  } else {
    return filteredWrapSearch.call(this, nextSearch, searchArr, skipArr, exceptionArr)
  }
}

module.exports = filteredWrapSearch
