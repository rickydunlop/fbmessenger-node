# fbmessenger

[![Greenkeeper badge](https://badges.greenkeeper.io/rickydunlop/fbmessenger-node.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/rickydunlop/fbmessenger-node.svg?branch=master)](https://travis-ci.org/rickydunlop/fbmessenger-node)
[![Coverage Status](https://coveralls.io/repos/github/rickydunlop/fbmessenger-node/badge.svg?branch=master)](https://coveralls.io/github/rickydunlop/fbmessenger-node?branch=master)
[![npm version](https://img.shields.io/npm/v/fbmessenger.svg?style=flat)](https://www.npmjs.com/package/fbmessenger)
[![npm](https://img.shields.io/npm/l/fbmessenger.svg?maxAge=2592000)]()

A  library to integrate with the [Facebook Messenger Platform](https://developers.facebook.com/docs/messenger-platform).


**Notice:**
Please read the [CHANGELOG](CHANGELOG.md) if upgrading to v4.
Every message you send must pass the recipients id

## Table of contents
<!-- MarkdownTOC depth="1" autolink="true" autoanchor="true" bracket="round" -->

- [Installation](#installation)
- [Express.js \(example usage\)](#expressjs-example-usage)
- [Events](#events)
- [Sending messages](#sending-messages)
- [Catching errors](#catching-errors)
- [Getting user details](#getting-user-details)
- [Elements](#elements)
- [Attachments](#attachments)
- [Templates](#templates)
- [Thread settings](#thread-settings)
- [Sender Actions](#sender-actions)
- [Quick Replies](#quick-replies)
- [Whitelisted domains](#whitelisted-domains)
- [Subscribing an app to a page](#subscribing-an-app-to-a-page)
- [Account linking](#account-linking)
- [Sending raw payloads](#sending-raw-payloads)

<!-- /MarkdownTOC -->

<a name="installation"></a>
## Installation

Execute this line in your app directory:

```
yarn add fbmessenger
```

or for npm

```
npm install --save fbmessenger
```

Import library into your app:

```javascript
import { Messenger } from 'fbmessenger';
```

Initialize it:

```javascript
const messenger = new Messenger({
  pageAccessToken: '<PAGE_ACCESS_TOKEN>'
});
```


<a name="configuration-of-facebook-app"></a>
### Configuration of facebook app

First of all visit the official [tutorial](https://developers.facebook.com/docs/messenger-platform/quickstart#steps]) and make sure you complete these 3 steps:

Steps:

* [Create page on Facebook](https://www.facebook.com/pages/create/) or use existing one if you already have it

* [Create app on Facebook](https://developers.facebook.com/quickstarts/?platform=web) or use existing one if you already have it

* Visit [your developer account](https://developers.facebook.com/apps/) and get the `PAGE_ACCESS_TOKEN`

* Subscribe the app to a page


<a name="expressjs-example-usage"></a>
## Express.js (example usage)

This is basic usage within an express.js application. For more detailed example look [here](https://github.com/rickydunlop/fbmessenger/blob/master/example/express-example.js).

```javascript
import bodyParser from 'body-parser';
import { Messenger } from 'fbmessenger';

// Configuring Body Parser middleware to parse the incoming JSON and Url-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Messenger
const messenger = new Messenger({
  pageAccessToken: '<PAGE_ACCESS_TOKEN>'
});

// here we define some listeners:
messenger.on('message', (event) => {
  // put your logic here
});

messenger.on('postback', (event) => {
  // put your logic here
});

// This example shows how to setup verification using express
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(400);
  }
});


// This route handles the webhook callbacks from Facebook
app.post('/webhook', (req, res) => {
  res.sendStatus(200);
  messenger.handle(req.body);
});
```

<a name="verifying-requests"></a>
## Verifying Requests

It's important but not fundamental to verify each request that your application receives to make sure that who is calling your `/webhook` endpoint is **Facebook** and not some other person. That could be done by through verifying the **Signature Hash** that **Facebook** sends on every request. You will need to have your `APP_SECRET` in hands for performing such verification.

```javascript
// Function that verifies the signature hash
const verifyRequestSignature = (req, res, buf) => {
    const signature = req.headers['x-hub-signature'];

    if (!signature) {
        throw new Error('Couldn\'t validate the signature.');
    } else {
        const elements = signature.split('=');
        const signatureHash = elements[1];
        const expectedHash = crypto.createHmac('sha1', process.env.APP_SECRET).update(buf).digest('hex');

        if (signatureHash !== expectedHash) {
            throw new Error('Couldn\'t validate the request signature.');
        }
    }
};

// Pass a function that verifies the signature instead of just calling app.use(bodyParser.json())
app.use(bodyParser.json({ verify: verifyRequestSignature });
```

<a name="events"></a>
## Events

Events are triggered when Facebook posts to your webhook url.
The following events can be listened for:

- message
- delivery
- optin
- read
- account_linking
- postback
- referral
- checkout_update
- payment

<a name="listening-for-events"></a>
### Listening for events

```javascript
messenger.on(<event>, (message) => {
	console.log(message);
});
```

_example console output_

```javascript
{
  sender: {
    id: 1234,
  },
  recipient: {
    id: 1234,
  },
  timestamp: 1457764197627,
  message: {
  	text: 'Hello World!'
  }
}
```

<a name="sending-messages"></a>
## Sending messages

Messages are sent using the `send(message, recipient)` method.
It returns a Promise (from node-fetch).

If replying to a user, the recipient can be obtained from `message.sender.id` in the event listener. Otherwise it should be a Facebook page scope ID from a database or other data store.


<a name="example"></a>
### Send a simple text reply

```javascript
messenger.on('message', (message) => {
  messenger.send({ text: 'Hello' }, message.sender.id);
});
```


<a name="catching-errors"></a>
## Catching errors

You can add a `catch` to get errors from the request.

```javascript
messenger.send({ text: "Hello" })
  .then(console.log(res))
  .catch(err => console.log(err));
```

or if using async/await you can wrap your code in a try/catch block

```javascript
messenger.on('message', async (message) => {
  try {
	await messenger.send({ text: 'Hello' }, message.sender.id);
  } catch (err) {
  	console.error(err);
  }
});
```

<a name="getting-user-details"></a>
## Get a user's details

Example usage:

```javascript
messenger.getUser()
  .then((user) => {
    messenger.send({
  	  text: `Hey ${user.first_name} ${user.last_name}`
    }, message.sender.id);
});
```

Returns object with user data:

* `first_name`
* `last_name`
* `profile_pic`
* `locale`
* `timezone`
* `gender`
* `is_payment_enabled`


<a name="elements"></a>
## Elements

<a name="text"></a>
### Text

[https://developers.facebook.com/docs/messenger-platform/send-api-reference/text-message](https://developers.facebook.com/docs/messenger-platform/send-api-reference/text-message)

Example usage:

```javascript
import { Text } from 'fbmessenger';

messenger.send(new Text('Hello World!'), message.sender.id);
```

you can also just pass an object to the `send` method like this

```javascript
{ text: 'Hello World!' }
```

<a name="button"></a>
### Button

[https://developers.facebook.com/docs/messenger-platform/send-api-reference/buttons](https://developers.facebook.com/docs/messenger-platform/send-api-reference/buttons)


#### Example (with ButtonTemplate):

```javascript
import {
  Button,
  ButtonTemplate
} from 'fbmessenger';

messenger.send(new ButtonTemplate(
  'Hey user! Watch these buttons:',
  [
    new Button({
      type: 'web_url',
      title: 'Web Url Button',
      url: 'http://www.example.com',
    }),
    new Button({
      type: 'postback',
      title: 'Postback Button',
      payload: 'POSTBACK_INFO',
    }),
  ]
), message.sender.id);
```

For more examples, check out the tests.

<a name="element"></a>
### Element

[https://developers.facebook.com/docs/messenger-platform/send-api-reference/generic-template](https://developers.facebook.com/docs/messenger-platform/send-api-reference/generic-template)

#### Example usage:

```javascript
import {
  Button,
  Element,
} from 'fbmessenger';

...
new Element({
  itle: 'Title',
  item_url: 'http://www.example.com',
  image_url: 'http://www.example.com',
  subtitle: 'Subtitle',
  buttons: [
    new Button({
      type: 'web_url',
      title: 'Web Url Button',
      url: 'http://www.example.com',
     }),
    new Button({
      type: 'postback',
      title: 'Postback Button',
      payload: 'POSTBACK_INFO',
      })
  ]
});
...
```

<a name="address"></a>
### Address

[https://developers.facebook.com/docs/messenger-platform/send-api-reference/receipt-template](https://developers.facebook.com/docs/messenger-platform/send-api-reference/receipt-template)

This element must be used with the Receipt template.

#### Example usage:

```javascript
import { Address } from 'fbmessenger';

...
new Address({
  street_1: '1 Hacker Way',
  street_2: '',
  city: 'Menlo Park',
  postal_code: '94025',
  state: 'CA',
  country: 'US'
});
...
```

<a name="summary"></a>
### Summary

[https://developers.facebook.com/docs/messenger-platform/send-api-reference/receipt-template](https://developers.facebook.com/docs/messenger-platform/send-api-reference/receipt-template)

This element must be used with the Receipt template.

#### Example usage:

```javascript
import { Summary } from 'fbmessenger';

...
new Summary({
  subtotal: 75.00,
  shipping_cost: 4.95,
  total_tax: 6.19,
  total_cost: 56.14
});
...
```

<a name="adjustment"></a>
### Adjustment

[https://developers.facebook.com/docs/messenger-platform/send-api-reference/receipt-template](https://developers.facebook.com/docs/messenger-platform/send-api-reference/receipt-template)

This element must be used with the Receipt template.

#### Example usage:

```javascript
import { Adjustment } from 'fbmessenger';

...
new Adjustment({
  name: 'Adjustment',
  amount: 20
});
...
```

<a name="attachments"></a>
## Attachments

<a name="image"></a>
### Image

[https://developers.facebook.com/docs/messenger-platform/send-api-reference/image-attachment](https://developers.facebook.com/docs/messenger-platform/send-api-reference/image-attachment)

#### Example usage:

```javascript
import { Image } from 'fbmessenger';

messenger.send(new Image({
  url: 'http://lorempixel.com/400/400/sports/1/',
}), message.sender.id);
```

<a name="audio"></a>
### Audio

[https://developers.facebook.com/docs/messenger-platform/send-api-reference/audio-attachment](https://developers.facebook.com/docs/messenger-platform/send-api-reference/audio-attachment)

#### Example usage:

```javascript
import { Audio } from 'fbmessenger';

messenger.send(new Audio({
  url: 'http://example.com/audio.mp3',
}), message.sender.id);
```

<a name="video"></a>
### Video

[https://developers.facebook.com/docs/messenger-platform/send-api-reference/video-attachment](https://developers.facebook.com/docs/messenger-platform/send-api-reference/video-attachment)

#### Example usage:

```javascript
import { Video } from 'fbmessenger';

messenger.send(new Video({
  url: 'http://example.com/video.mp4',
}), message.sender.id);
```

<a name="file"></a>
### File

[https://developers.facebook.com/docs/messenger-platform/send-api-reference/file-attachment](https://developers.facebook.com/docs/messenger-platform/send-api-reference/file-attachment)

#### Example usage:

```javascript
import { File } from 'fbmessenger';

messenger.send(new File({
  url: 'http://example.com/file.txt',
}), message.sender.id);
```

<a name="reusable-attachments"></a>
### Reusable attachments

Attachments can be reused by passing `true` as the second parameter. This sets the `is_reusable` flag.

```javascript
const image = new Image({
  url: 'http://lorempixel.com/400/400/sports/1/',
  is_reusable: true
});
messenger.send(image, message.sender.id);
```

You can then use the `attachment_id` from the response to send the same attachment again

```javascript
messenger.send(new Image({ attachment_id: 12345 }, message.sender.id);
```

<a name="templates"></a>
## Templates

<a name="buttontemplate"></a>
### ButtonTemplate

[https://developers.facebook.com/docs/messenger-platform/send-api-reference/button-template](https://developers.facebook.com/docs/messenger-platform/send-api-reference/button-template)

#### Example usage:

```javascript
import {
  Button,
  ButtonTemplate
} from 'fbmessenger';

messenger.send(new ButtonTemplate(
  'Hey user! Watch these buttons:',
  [
    new Button({
      type: 'web_url',
      title: 'Web Url Button',
      url: 'http://www.example.com',
    }),
    new Button({
      type: 'postback',
      title: 'Postback Button',
      payload: 'POSTBACK_INFO',
    })
  ]
), message.sender.id);
```

#### GenericTemplate

[https://developers.facebook.com/docs/messenger-platform/send-api-reference/generic-template](https://developers.facebook.com/docs/messenger-platform/send-api-reference/generic-template)

#### Example usage:

```javascript
import {
  Button,
  Element
  GenericTemplate
} from 'fbmessenger';

messenger.send(new GenericTemplate(
[
  new Element({
    title: 'Title',
    item_url: 'http://www.example.com',
    image_url: 'http://www.example.com',
    subtitle: 'Subtitle',
    buttons: [
      new Button({
        type: 'web_url',
        title: 'Button',
        url: 'http://www.example.com',
      }),
    ]
  }),
  ...
]
), message.sender.id);
```

#### ReceiptTemplate

[https://developers.facebook.com/docs/messenger-platform/send-api-reference/receipt-template](https://developers.facebook.com/docs/messenger-platform/send-api-reference/receipt-template)

#### Example usage:

```javascript
import {
  Button,
  Element,
  Address,
  Summary,
  Adjustment,
  ReceiptTemplate
} from 'fbmessenger';

messenger.send(new ReceiptTemplate({
  recipient_name: 'Name',
  order_number: '123',
  currency: 'USD',
  payment_method: 'Visa',
  order_url: 'http://www.example.com',
  timestamp: '123123123',
  elements: [
    new Element({
      title: 'Title',
      image_url: 'http://www.example.com',
      subtitle: 'Subtitle',
      currency: 'USD',
      quantity: 1,
      price: 15
    })
  ],
  address: new Address({
    street_1: '1 Hacker Way',
    street_2: '',
    city: 'Menlo Park',
    postal_code: '94025',
    state: 'CA',
    country: 'US'
  }),
  summary: new Summary({
    subtotal: 75.00,
    shipping_cost: 4.95,
    total_tax: 6.19,
    total_cost: 56.14
  }),
  adjustments: [
    new Adjustment('Adjustment', 20)
  ]
}), message.sender.id);
```

<a name="thread-settings"></a>
## Thread settings
<a name="greeting-text"></a>
### Greeting Text

[https://developers.facebook.com/docs/messenger-platform/thread-settings/greeting-text](https://developers.facebook.com/docs/messenger-platform/thread-settings/greeting-text)

```javascript
import { GreetingText } from fbmessenger

const greeting = new GreetingText('Hello');
messenger.setThreadSetting(greeting);
```

There is also a method to delete the greeting text called `deleteGreetingText`

<a name="get-started-button"></a>
### Get Started Button

[https://developers.facebook.com/docs/messenger-platform/thread-settings/get-started-button](https://developers.facebook.com/docs/messenger-platform/thread-settings/get-started-button)

```javascript
import { GetStartedButton } from 'fbmessenger';

const getStarted = new GetStartedButton('start');
messenger.setThreadSetting(getStarted);
```

When someone first interacts with your bot they will see a `Get Started` button. When this is clicked it will send a `postback` to your server with the value of `start`.

There is also a method to delete the Get Started Button called `deleteGetStarted`

<a name="persistent-menu"></a>
### Persistent Menu

[https://developers.facebook.com/docs/messenger-platform/thread-settings/persistent-menu](https://developers.facebook.com/docs/messenger-platform/thread-settings/persistent-menu)

```javascript
import {
  PersistentMenu,
  PersistentMenuItem
} from 'fbmessenger';

const item_1 = new PersistentMenuItem({
	item_type: 'web_url',
	title: 'Menu button 1',
	url: 'http://facebook.com'
});

const item_2 = new PersistentMenuItem({
	item_type: 'payload',
	title: 'Menu button 2',
	payload: 'menu_button_2'
});

const item_3 = new PersistentMenuItem({
	item_type: 'web_url',
	title: 'Menu button 3',
	url: 'http://facebook.com',
	webview_height_ratio: 'tall',
	messenger_extensions: true
});

const menu = new PersistentMenu([item_1, item_2, item_3]);
messenger.setThreadSetting(menu);
```

You can delete the Persistent Menu using the `deletePersistentMenu` method

<a name="sender-actions"></a>
## Sender Actions

Available actions are

- `typing_on`
- `typing_off`
- `mark_seen`

```javascript
messenger.senderAction('typing_on', message.sender.id);
```

<a name="quick-replies"></a>
## Quick Replies

Quick Replies work with all message types including text message, image and template attachments.

```javascript
const reply1 = new QuickReply({
  title: 'Example',
  payload: 'payload',
});
const reply2 = new QuickReply({
  title: 'Location',
  content_type: 'location',
});
const quick_replies = new QuickReplies([reply1, reply2]);

const text = new Text('A simple text message')

const payload = Object.assign(text, quick_replies)

messenger.send(payload, message.sender.id)
```

<a name="whitelisted-domains"></a>
## Whitelisted domains

<a name="adding"></a>
### Adding

```javascript
// Single
messenger.addWhitelistedDomain('http://example.com');

// Multiple
messenger.addWhitelistedDomains(['http://example.com', 'http://example2.com']);
```

<a name="removing"></a>
### Removing

```javascript
// Single
messenger.removeWhitelistedDomain('http://example.com');

// Multiple
messenger.removeWhitelistedDomains(['http://example.com', 'http://example2.com']);
```

<a name="subscribing-an-app-to-a-page"></a>
## Subscribing an app to a page

The easiest way to do this is now through the Facebook developer site. If you need to do this progamatically you can use `subscribeAppToPage`


<a name="account-linking"></a>
## Account linking

You can link and unlink accounts with `linkAccount` and `unlinkAccount`

```javascript
messenger.linkAccount('ACCOUNT_LINKING_TOKEN');
```

```javascript
messenger.unlinkAccount('PSID');
```

<a name="sending-raw-payloads"></a>
## Sending raw payloads

You can also send raw payloads with `send`. This lets you use any new features from Facebook while waiting for support to be added to this library.

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
          }
        ]
      }
    }
  }, message.sender.id);
});
```
