const querystring = require('querystring');
var testData = require('../../lib/message/testData.js')

testData = querystring.parse(testData.toString('utf8'))

module.exports = testData
