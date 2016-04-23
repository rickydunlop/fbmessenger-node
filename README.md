# messenger-wrapper
[![Build Status](https://travis-ci.org/justynjozwiak/messenger-wrapper.svg?branch=master)](https://travis-ci.org/justynjozwiak/messenger-wrapper)
[![CoverageStatus](https://coveralls.io/repos/github/justynjozwiak/messenger-wrapper/badge.svg?branch=master)](https://coveralls.io/github/justynjozwiak/messenger-wrapper?branch=master)
[![npm version](https://img.shields.io/npm/v/messenger-wrapper.svg?style=flat)](https://www.npmjs.com/package/messenger-wrapper)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Dependency Status](https://www.versioneye.com/user/projects/571a18b3fcd19a00415b21bc/badge.svg)](https://www.versioneye.com/user/projects/571a18b3fcd19a00415b21bc)
[![Github Issues](http://githubbadges.herokuapp.com/justynjozwiak/messenger-wrapper/issues.svg)](https://github.com/justynjozwiak/messenger-wrapper/issues)
[![License](http://img.shields.io/:license-MIT-blue.svg)](http://badges.mit-license.org)

A simple library for handling [Facebook Messenger Bots](https://developers.facebook.com/docs/messenger-platform).

## Installation :electric_plug:

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

First of all visit this official [tutorial](https://developers.facebook.com/docs/messenger-platform/quickstart#steps])) and
make sure you complete these :three: steps:

:exclamation: Subscribe the App to a Page - remember that instead of making subscription call manually:

```
curl -X POST "https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=<PAGE_ACCESS_TOKEN>"
```

you can always run you express app with all necessary routes defined and go under `/subscribe`. See the first example for more details.

Steps:

:one: [Create page on Facebook](https://www.facebook.com/pages/create/) or use existing one if you already have it

:two: [create app on Facebook](https://developers.facebook.com/quickstarts/?platform=web) or use existing one if you already have it

:three: visit [your developer account](https://developers.facebook.com/apps/) and get `PAGE_ACCESS_TOKEN` to initialize wrapper

## Express.js (example usage) :book:

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
  messenger.sendData({ text: 'hello user' }, event);
});

messenger.on('delivery', (event) => {
  //put your logic here
  messenger.sendData({ text: 'hello user' }, event);
});

messenger.on('postback', (event) => {
  //put your logic here
  messenger.sendData({ text: 'hello user' }, event);
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

#### `wrapper.on('message', (event))`

Event triggered when the bot receives message from the user.

`event` - object with payload received from messenger user

Example usage:

```javascript
messenger.on('message', (event) => {
  messenger.sendData({ text: 'Welcome!' }, event);
});
```

#### `wrapper.on('delivery', (event))`

Event triggered when the message has been successfully delivered to the user.

`event` - object with payload received from messenger user

Example usage:

```javascript
messenger.on('delivery', (event) => {
  messenger.sendData({ text: 'Message has been delivered!' }, event);
});
```

#### `wrapper.on('postback', (event))`

Event triggered when the postback action is triggered by the user.

`event` - object with payload received from messenger user

Example usage:

```javascript
messenger.on('postback', (event) => {
  messenger.sendData({ text: 'Postback event!' }, event);
});
```

### Functions
