# Nag
An sms-based chore reminder app.

## Setup
1. `npm install`

2. Add your Twilio Credentials -- your accountSid, authToken, and phoneNumber -- to 'src/config.js'. Once logged in to Twilio this info can be found [here](https://www.twilio.com/user/account/messaging/dev-tools/api-explorer/message-create).

3. Use [localtunnel](https://github.com/localtunnel/localtunnel) to tunnel from the web to localhost. In the project file we'll run two commands
    ```
    npm install -g localhost
    lt --port 3000 --subdomain nagdemo
    ```

4. Name the chore and the two phones objects in 'src/database.json'. Fill in "+phoneNumber" for the two phone objects within phones with two different, full 10-digit phone numbers preceded by '+1' (ex: '+15038675309'). Fill in "choreName" for the chore object within chores with a chore (ex: 'Empty Dishwasher'), then fill in the  assignee property of that chore with one of the previously used phone numbers (ex: '+15038675309'). Do not worry about adding other objects and/or properties. The server will ask users for their names and fill out other properties once it begins running.

5. Run server.js from the src folder: `node server.js`.

If you'd like you can mess with the cron strings for autoIntroFreq and choreReminderRefresh. Respectively, they control how frequently auto introductions are sent to phones with null for person, and how frequently scheduler checks the last reminders on chores. ChoreReminderFreq establishes how frequently last reminder is updated, and thus how frequently reminders will actually be sent.

## Use
Commands work like a really simple CLI, they are:
```
nag chore <<data-entry>>
nag skip <<data-entry>>
nag done <<data-entry>>
```
Here double brackets denote a placeholder.
Commands are engaged with the format 'nag <<command>> <<data-entry>>' sent in an sms message body (ex: `nag chore Empty Dishwasher`). These three commands do not create or delete data-entries within 'src/database.json'. Instead they operate on pre-existing, named data-entries.
'nag chore <<data-entry>>' sets the ready property of the specified chore to true and begins sending reminders to its assignee at the interval specified in config.js by choreReminderFreq.
'nag skip <<data-entry>>' skips the chore for the senders phone if its ready property is true, decrementing the skip property of this phone and switching the assignee. It can be done even if the sender is not the current assignee (it queues the skip in an array).
Phone numbers in the array at choreName.exceptions will always be skipped.
Finally, 'nag done <<data-entry>>' -- if sent from the current assignee -- un-readies the chore and assigns the next phone in phones, provided the next phone has not skipped and is not an exception.

## Customizing Routes
Adding new commands is simple. In 'lib/route.js' add a new property to the route object. Set it to a callback function that takes a parameter -- `data` -- inside which a call to the exec function also takes `data`. The exec function takes four arguments. The first we just covered; `data` is an array of three variables compiled by the http server when messageData is received: message, phoneData, and chores. Second is a condition, which can be a boolean or a callback. This condition, as a callback, has access to all data elements from its context. After it has evaluated, and if it returns true, exec's third argument, another callback, fires off. Within this third callback you also have access to `data`. Finally, the last argument is an an options object. It's use is detailed at the top of the route file.
Once this route has been created it will reply with the property of the same name in the 'src/dialog.json' file if the second exec argument evaluates to true. The returnMessage option can be used to replace all double enclosed brackets ('<<>>') inside any dialog in string with the result of functions in an array. They also have access to `data`. Once the route is finished, all objects are pushed to their JSON files separately by the http server.
