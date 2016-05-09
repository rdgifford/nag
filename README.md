# Nag
An sms-based chore reminder app.

## Setup
Add your Twilio Credentials -- your accountSid, authToken, and phoneNumber -- to private.js. Once logged in to Twilio this info can be found [here](https://www.twilio.com/user/account/messaging/dev-tools/api-explorer/message-create).

Use [ngrok](https://ngrok.com/download) to tunnel from the web to localhost.
Unzip and run the exec. With the command `./ngrok http 3000`, launch ngrok at port 3000. Open the terminal window running ngrok, copy the http forwarding address, and paste it into 'private.js' as postURI behind the subdomain '/messageData'.
That full address is then the Request URL for your [twilio messaging phone number](https://www.twilio.com/user/account/messaging/phone-numbers).

That's it for setup in 'private.js'. If you'd like you can mess with the cron strings for autoIntroFreq and choreReminderRefresh. Respectively, they control how frequently auto introductions are sent to phones with null for person, and how frequently scheduler checks the last reminders on chores. ChoreReminderFreq establishes how frequently last reminder is updated, and thus how frequently reminders will actually be sent.

Now, add a chore and two users to the database. To add users, just fill in phoneNumber for the two phone objects within phones with two different phone numbers as strings, ex: '+15035777844'. Lastly, give the chore a name, and give it an assignee by copying and pasting one of the phone numbers as the current choreName.assignee.

Make sure to do an `npm install`, then just run server.js inside src: `node server.js`.

## Use
Commands work like a really simple CLI, and they are:
```
nag chore
nag skip
nag done
```
Commands are engaged with 'nag' in a sms message body. They must be followed by a space and the name of a chore under chores. For example, `nag chore Empty Dishwasher`.
Chore readies the specified chore and begins nagging its assignee at the interval specified in private.js with choreReminderFreq.
Skip skips the chore if it has been readied, taking a skip from the phone it's sent from. It can be done even if the sender is not the current assignee (it queues the skip in an array).
Phone numbers in the array at choreName.exceptions will always be skipped.
Finally, done -- if sent from the current assignee -- un-readies the chore and assigns the next phone in phones, provided the next phone has not skipped and is not an exception.

## Customizing Routes
Adding new commands is simple. In route.js (inside the lib folder) add a new property to the route object. Set it to a callback function that takes a parameter -- `data` -- inside which a call to the exec function also takes `data`. The exec function takes four arguments. The first we just covered; Data is an array of three variables compiled by the http server when messageData is received: message, phoneData, and chores. Second is a condition, which can be a boolean or a callback. This condition, as a callback, has access to all data elements from its context. After it has evaluated, and if it returns true, exec's third argument, another callback, fires off. Within this third callback you also have access to `data`. Finally, the last argument is an an options object. It's use is detailed at the top of the route file.
Once this route has been created it will reply with the property of the same name in the dialog.json file if the second exec argument evaluates to true. The returnMessage option can be used to replace all double enclosed brackets ('<<>>') inside any dialog in string with the result of functions in an array. They also have access to `data`. Once the route is finished, all objects are pushed to their databases separately by the http server.
