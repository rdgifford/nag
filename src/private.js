// Twilio Credentials
module.exports = {
  // Twilio Credentials
  accountSid: '',
  authToken: '',
  // Your Twilio Phone Number
  phoneNumber: '+1',
  // Your postURI for twilio
  postURI: '/messageData',
  // Scheduler Options
  autoIntroFreq: '/10 * * * * *',
  choreReminderRefresh: '/10 * * * * *',
  // Chore Reminder Frequency
  // how often users will receive reminders on doing chores (in milliseconds)
  choreReminderFreq: 60 * 60 * 1000 * 4
}
