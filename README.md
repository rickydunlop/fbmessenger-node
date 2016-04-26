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

This is sample usage within express.js application. For full example look [here](https://github.com/justynjozwiak/messenger-wrapper/blob/master/example/express-example.js).

```javascript
import MessengerWrapper from 'messenger-wrapper';

//let's initialize our wrapper here
let messenger = new MessengerWrapper({
  verifyToken:     '<VERIFY_TOKEN>',
  pageAccessToken: '<PAGE_ACCESS_TOKEN>'
});

//here we define 3 available listeners: 'message', 'delivery', 'postback' and 'optin':
messenger.on('message', (event) => {
  //put your logic here
});

messenger.on('delivery', (event) => {
  //put your logic here
});

messenger.on('postback', (event) => {
  //put your logic here
});

messenger.on('optin', (event) => {
  //put your logic here
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
actions, so you don't have to worry about losing any data. To get latest entry you should use `messenger.lastEntry` object or use dedicated methods like `send()` or `getUserId()` (and more `soon`) that operate on `messenger.lastEntry` object. Go through
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

#### `messenger.on('optin', (event))`

Event triggered when the optin action is triggered by the user.

`event` - object with payload received from messenger user

Example usage:

```javascript
messenger.on('optin', (event) => {
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

### Elements

#### `MessengerText(text)`

`text` - your text message to the user

This element can be sent separately.

Returns proper text hash:

```javascript
{ text: 'text attribute' }
```

Example usage:

```javascript
import { MessengerText } from 'messenger-wrapper';

messenger.on('message', () => {
  messenger.send(new MessengerText('Hello user!'));
});
```

#### `MessengerImage(url)`

`url` - url to the image

This element can be sent separately.

Returns proper image hash:

```javascript
attachment: {
  type: 'image',
  payload: {
    url: 'http://yoururl.com/image'
  }
}
```

Example usage:

```javascript
import { MessengerImage } from 'messenger-wrapper';

messenger.on('message', () => {
  messenger.send(new MessengerImage('http://lorempixel.com/400/400/sports/1/'));
});
```

#### `MessengerButton(attrs)`

`attrs` - object containing two attributes:

`{ url: 'url', title: 'title' }` or `{ title: 'title', payload: 'payload' }`

This element CANNOT be sent separately. Use it with Button, Generic or Receipt templates.

Returns proper button hash depending on attributes set:

First:

```javascript
{
  type: 'web_url',
  url: 'url',
  title: 'title'
}
```

Second:

```javascript
{
  type: 'postback',
  title: 'title',
  payload: 'payload'
}
```

Example usage (with MessengerButtonTemplate):

```javascript
import {
  MessengerButton,
  MessengerButtonTemplate
} from 'messenger-wrapper';

messenger.on('message', () => {
  messenger.send(new MessengerButtonTemplate(
    'Hey user! Watch these buttons:',
    [
      new MessengerButton({ title: 'Web Url Button', url: 'http://www.example.com' }),
      new MessengerButton({ title: 'Postback Button', payload: 'POSTBACK_INFO' })
    ]
  ));
});
```

### `MessengerBubble(attrs)`

`attrs` - hash attributes defined in Facebook documentation

This element CANNOT be sent separately. Use it with Generic or Receipt templates.

Returns `attrs` object:

```javascript
{
  title: 'Title',
  item_url: 'http://www.example.com',
  image_url: 'http://www.example.com',
  subtitle: 'Subtitle',
  buttons: [
    {
      type: 'web_url',
      title: 'Button',
      url: 'http://www.example.com'
    }
  ]
}
```

Example usage:

```javascript
import {
  MessengerButton,
  MessengerBubble,
} from 'messenger-wrapper';

...
new MessengerBubble({
  itle: 'Title',
  item_url: 'http://www.example.com',
  image_url: 'http://www.example.com',
  subtitle: 'Subtitle',
  buttons: [
    new MessengerButton({ title: 'Web Url Button', url: 'http://www.example.com' }),
    new MessengerButton({ title: 'Postback Button', payload: 'POSTBACK_INFO' })
  ]
});
...
```

### `MessengerAddress(attrs)`

`attrs` - hash attributes defined in Facebook documentation

This element CANNOT be sent separately. Use it with Receipt template.

Returns `attrs` object:

```javascript
{
  street_1: '1 Hacker Way',
  street_2: '',
  city: 'Menlo Park',
  postal_code: '94025',
  state: 'CA',
  country: 'US'
}
```

Example usage:

```javascript
import {
  MessengerAddress
} from 'messenger-wrapper';

...
new MessengerAddress({
  street_1: '1 Hacker Way',
  street_2: '',
  city: 'Menlo Park',
  postal_code: '94025',
  state: 'CA',
  country: 'US'
});
...
```

### `MessengerSummary(attrs)`

`attrs` - hash attributes defined in Facebook documentation

This element CANNOT be sent separately. Use it with Receipt template.

Returns `attrs` object:

```javascript
{
  subtotal: 75.00,
  shipping_cost: 4.95,
  total_tax: 6.19,
  total_cost: 56.14
}
```

Example usage:

```javascript
import {
  MessengerSummary
} from 'messenger-wrapper';

...
new MessengerSummary({
  subtotal: 75.00,
  shipping_cost: 4.95,
  total_tax: 6.19,
  total_cost: 56.14
});
...
```

### `MessengerAdjustment(text, amount)`

`text` - text attribute according to Facebook documentation

`amount` - amount attribute according to Facebook documentation

This element CANNOT be sent separately. Use it with Receipt template.

Returns `attrs` object:

```javascript
{
  name: 'Adjustment',
  amount: 20
}
```

Example usage:

```javascript
import {
  MessengerAdjustment
} from 'messenger-wrapper';

...
new MessengerAdjustment({
  name: 'Adjustment',
  amount: 20
});
...
```

### Templates

#### `MessengerButtonTemplate(text, buttons)`

`text` - text attribute
`buttons` - array with buttons

Returns proper template object:

```javascript
{
  attachment: {
    type: 'template',
    payload: {
      template_type: 'button',
      text: 'Hello user!',
      buttons: [
        {
          type: 'web_url',
          title: 'Button',
          url: 'http://www.example.com'
        }
      ]
    }
  }
}
```

Example usage:

```javascript
import {
  MessengerButton,
  MessengerButtonTemplate
} from 'messenger-wrapper';

messenger.on('message', () => {
  messenger.send(new MessengerButtonTemplate(
    'Hey user! Watch these buttons:',
    [
      new MessengerButton({ title: 'Web Url Button', url: 'http://www.example.com' }),
      new MessengerButton({ title: 'Postback Button', payload: 'POSTBACK_INFO' })
    ]
  ));
});
```

#### `MessengerGenericTemplate(bubbles)`

`bubbles` - array with bubbles

Returns proper generic template object:

```javascript
{
  attachment: {
    type: 'template',
    payload: {
      template_type: 'generic',
      elements: [
        {
          title: 'Title',
          item_url: 'http://www.example.com',
          image_url: 'http://www.example.com',
          subtitle: 'Subtitle',
          buttons: [
            {
              type: 'web_url',
              title: 'Button',
              url: 'http://www.example.com'
            }
          ]
        }
      ]
    }
  }
}
```

Example usage:

```javascript
import {
  MessengerButton,
  MessengerBubble
  MessengerGenericTemplate
} from 'messenger-wrapper';

messenger.on('message', () => {
  messenger.send(new MessengerGenericTemplate(
    [
      new MessengerBubble({
        title: 'Title',
        item_url: 'http://www.example.com',
        image_url: 'http://www.example.com',
        subtitle: 'Subtitle',
        buttons: [
          new MessengerButton({ title: 'Button', url: 'http://www.example.com' })
        ]
      }),
      ...
    ]
  ));
});
```

#### `MessengerReceiptTemplate(attrs)`

`attrs` - attributes hash according to Facebook documentation

Returns proper receipt template object:

```javascript
{
  attachment: {
    type: 'template',
    payload: {
      template_type: 'receipt',
      recipient_name: 'Name',
      order_number: '123',
      currency: 'USD',
      payment_method: 'Visa',
      order_url: 'http://www.example.com',
      timestamp: '123123123',
      elements: [
        {
          title: 'Title',
          item_url: 'http://www.example.com',
          image_url: 'http://www.example.com',
          subtitle: 'Subtitle',
          buttons: [
            {
              type: 'web_url',
              title: 'Button',
              url: 'http://www.example.com'
            }
          ]
        }
      ],
      address: {
        street_1: '1 Hacker Way',
        street_2: '',
        city: 'Menlo Park',
        postal_code: '94025',
        state: 'CA',
        country: 'US'
      },
      summary: {
        subtotal: 75.00,
        shipping_cost: 4.95,
        total_tax: 6.19,
        total_cost: 56.14
      },
      adjustments: [
        {
          name: 'Adjustment',
          amount: 20
        }
      ]
    }
  }
}
```

Example usage:

```javascript
import {
  MessengerButton,
  MessengerBubble,
  MessengerAddress,
  MessengerSummary,
  MessengerAdjustment,
  MessengerReceiptTemplate
} from 'messenger-wrapper';

messenger.on('message', () => {
  messenger.send(new MessengerReceiptTemplate({
    recipient_name: 'Name',
    order_number: '123',
    currency: 'USD',
    payment_method: 'Visa',
    order_url: 'http://www.example.com',
    timestamp: '123123123',
    elements: [
      new MessengerBubble({
        title: 'Title',
        item_url: 'http://www.example.com',
        image_url: 'http://www.example.com',
        subtitle: 'Subtitle',
        buttons: [
          new MessengerButton({ title: 'Button', url: 'http://www.example.com' })
        ]
      })
    ],
    address: new MessengerAddress({
      street_1: '1 Hacker Way',
      street_2: '',
      city: 'Menlo Park',
      postal_code: '94025',
      state: 'CA',
      country: 'US'
    }),
    summary: new MessengerSummary({
      subtotal: 75.00,
      shipping_cost: 4.95,
      total_tax: 6.19,
      total_cost: 56.14
    }),
    adjustments: [
      new MessengerAdjustment('Adjustment', 20)
    ]
  });
});
```
