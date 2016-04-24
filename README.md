# messenger-wrapper
[![Build Status](https://travis-ci.org/justynjozwiak/messenger-wrapper.svg?branch=master)](https://travis-ci.org/justynjozwiak/messenger-wrapper)
[![CoverageStatus](https://coveralls.io/repos/github/justynjozwiak/messenger-wrapper/badge.svg?branch=master)](https://coveralls.io/github/justynjozwiak/messenger-wrapper?branch=master)
[![npm version](https://img.shields.io/npm/v/messenger-wrapper.svg?style=flat)](https://www.npmjs.com/package/messenger-wrapper)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Dependency Status](https://www.versioneye.com/user/projects/571a18b3fcd19a00415b21bc/badge.svg)](https://www.versioneye.com/user/projects/571a18b3fcd19a00415b21bc)
[![Github Issues](http://githubbadges.herokuapp.com/justynjozwiak/messenger-wrapper/issues.svg)](https://github.com/justynjozwiak/messenger-wrapper/issues)
[![License](http://img.shields.io/:license-MIT-blue.svg)](http://badges.mit-license.org)

A simple library for handling [Facebook Messenger Bots](https://developers.facebook.com/docs/messenger-platform).

## Installation

Execute this line in your app directory:

```
npm install --save messenger-wrapper
```

Import library into your app:

```javascript
import MessengerWrapper from 'messenger-wrapper';
```

Initialize it:

```javascript
let messenger = new MessengerWrapper({
  verifyToken:     '<VERIFY_TOKEN>',
  pageAccessToken: '<PAGE_ACCESS_TOKEN>'
});
```

and you are ready to go.

## Configuration (facebook's side)

First of all visit this official [tutorial](https://developers.facebook.com/docs/messenger-platform/quickstart#steps]) and
make sure you complete these 3 steps:

Subscribe the App to a Page - remember that instead of making subscription call manually:

```
curl -X POST "https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=<PAGE_ACCESS_TOKEN>"
```

You can always run you express app with all necessary routes defined and go under `/subscribe`. See the first example for more details.

Steps:

* [Create page on Facebook](https://www.facebook.com/pages/create/) or use existing one if you already have it

* [create app on Facebook](https://developers.facebook.com/quickstarts/?platform=web) or use existing one if you already have it

* visit [your developer account](https://developers.facebook.com/apps/) and get `PAGE_ACCESS_TOKEN` to initialize wrapper

## Express.js (example usage)

This is sample usage withing express.js application. For full example look [here](https://github.com/justynjozwiak/messenger-wrapper/blob/master/example/express-example.js).

```javascript
import MessengerWrapper from 'messenger-wrapper';

//let's initialize our wrapper here
let messenger = new MessengerWrapper({
  verifyToken:     '<VERIFY_TOKEN>',
  pageAccessToken: '<PAGE_ACCESS_TOKEN>'
});

//here we define 3 available listeners: 'message', 'delivery' and 'postback'
messenger.on('message', (event) => {
  //put your logic here
  messenger.send({ text: 'hello user' });
});

messenger.on('delivery', (event) => {
  //put your logic here
  messenger.send({ text: 'hello user' });
});

messenger.on('postback', (event) => {
  //put your logic here
  messenger.send({ text: 'hello user' });
});

//this route is needed for facebook messenger verification
app.get('/webhook', (req, res) => {
  messenger.verify(req, res);
});

//according to documentation https://developers.facebook.com/docs/messenger-platform/implementation
//instead of sending this request manually -> curl -X POST "https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=<PAGE_ACCESS_TOKEN>"
//you can just run your express app and go under /subscribe in your web browser
app.get('/subscribe', (req, res) => {
  messenger.subscribe().then((response) => {
    res.send(response.body);
  });
});

//here we handle messenger data, you've got nothing to do here, just define that route
app.post('/webhook', (req, res) => {
  res.sendStatus(200);
  messenger.handle(req);
});
```

## Documentation

### Events

Basically we have 3 types of events according to Facebook documentation:

ATTENTION:

`(event)` param here is optional, you can omit it, and it's only purpose is to show you incoming data. According to Facebook documentation
each incoming data can containt multiple `entries`, that's why this library supports iterating over them in background and emits proper
actions, so you don't have to worry about losing any data. To get latest entry you should use `messenger.lastEntry` object. Go through
documentation to see examples.

#### `messenger.on('message', (event))`

Event triggered when the bot receives message from the user.

`event` - object with payload received from messenger user

Example usage:

```javascript
messenger.on('message', (event) => {
  messenger.send({ text: 'Welcome!' });
});
```

#### `messenger.on('delivery', (event))`

Event triggered when the message has been successfully delivered to the user.

`event` - object with payload received from messenger user

Example usage:

```javascript
messenger.on('delivery', (event) => {
  messenger.send({ text: 'Message has been delivered!' });
});
```

#### `messenger.on('postback', (event))`

Event triggered when the postback action is triggered by the user.

`event` - object with payload received from messenger user

Example usage:

```javascript
messenger.on('postback', (event) => {
  messenger.send({ text: 'Postback event!' });
});
```

### Functions

#### `messenger.send(payload)`

`payload` - object with data that will be send to the user, see [docs](https://developers.facebook.com/docs/messenger-platform/send-api-reference#request) for format specification

Example usage:

```javascript
messenger.on('message', () => {
  messenger.send({
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"What do you want to do next?",
        "buttons":[
          {
            "type":"web_url",
            "url":"https://petersapparel.parseapp.com",
            "title":"Show Website"
          },
          {
            "type":"postback",
            "title":"Start Chatting",
            "payload":"USER_DEFINED_PAYLOAD"
          }
        ]
      }
    }
  });
});
```

#### `messenger.getUser()`

Returns object with user data:

* `first_name`
* `last_name`
* `profile_pic`

Example usage:

```javascript
messenger.on('message', () => {
  messenger.getUser().then((user) => {
    messenger.send({ text: `Hey ${user.first_name} ${user.last_name}` });
  });
});
```

#### `messenger.getUserId()`

Returns ID of the user who sent the message.

Example usage:

```javascript
messenger.on('postback', () => {
  console.log(messenger.getUserId());
});
```
