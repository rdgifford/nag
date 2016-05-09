// return the first match in arr if test evaluates to true
function fetchFirst(arr, test, ctx) {
  var result = null;
  arr.some(function(el, i) {
    // call the supplied test callback and if it evalutes to true,
    // assign match to result and return true, otherwise return false
    return test.call(ctx, el, i, arr) ? ((result = el), true) : false;
  });
  return result;
}

module.exports = fetchFirst
