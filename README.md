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
npm install messenger-wrapper --save
```

## Express.js (example usage)

```javascript
import MessengerWrapper from 'messenger-wrapper';

let messenger = new MessengerWrapper({
  verifyToken:     '<VERIFY_TOKEN>',
  pageAccessToken: '<PAGE_ACCESS_TOKEN>'
});

messenger.on('message', (event) => {
  messenger.sendData({ text: 'hello user' }, event);
});

messenger.on('delivery', (event) => {
  messenger.sendData({ text: 'hello user' }, event);
});

messenger.on('postback', (event) => {
  messenger.sendData({ text: 'hello user' }, event);
});

app.get('/webhook', (req, res) => {
  messenger.verify(req, res);
});

app.get('/subscribe', (req, res) => {
  messenger.subscribe().then((response) => {
    res.send(response.body);
  });
});

app.post('/webhook', (req, res) => {
  res.sendStatus(200);
  messenger.handle(req);
});
```
