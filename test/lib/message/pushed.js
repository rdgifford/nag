var dbentry = function(message) {
  return "{\"SmsSid\":\"" + message.SmsSid + "\",\"Body\":\"" + message.Body + "\"}";
}

module.exports = dbentry
