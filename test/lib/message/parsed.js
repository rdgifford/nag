const querystring = require('querystring');

var testmessage = "ToCountry=US&ToState=OR&SmsMessageSid=SM192aa81228f1357eb5ad5aaa8b41e6bf&NumMedia=0&ToCity=PORTLAND&FromZip=97217&SmsSid=SM192aa81228f1357eb5ad5aaa8b41e6bf&FromState=OR&SmsStatus=received&FromCity=PORTLAND&Body=5&FromCountry=US&To=%2B15038820432&ToZip=97209&NumSegments=1&MessageSid=SM192aa81228f1357eb5ad5aaa8b41e6bf&AccountSid=ACfb98cd2cee4e1776236b872f4dbb0cb3&From=%2B15035777844&ApiVersion=2010-04-01"
testmessage = querystring.parse(testmessage.toString('utf8'))

module.exports = testmessage
