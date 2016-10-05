import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';

import {
  Messenger,
  Button,
  Element,
  Image,
  Video,
  GenericTemplate,
  GreetingText,
  GetStartedButton,
  PersistentMenuItem,
  PersistentMenu,
  QuickReply,
  QuickReplies,
  ReceiptTemplate,
  Address,
  Summary,
  Adjustment,
} from '../lib/Messenger';

const path = require('path');

dotenv.config({ silent: true });

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

const messenger = new Messenger({
  pageAccessToken: process.env.PAGE_ACCESS_TOKEN,
});

const WHITELISTED_DOMAINS = [
  'https://bbc.co.uk',
  'https://stackoverflow.com',
  'https://357f6bc9.ngrok.io',
];

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function init_bot() {
  messenger.addWhitelistedDomains(WHITELISTED_DOMAINS);

  // Greeting Text
  const greetingText = new GreetingText('Welcome to the bot demo.');
  const greetingTextResult = await messenger.setThreadSetting(greetingText);
  console.log(`Greeting Text: ${JSON.stringify(greetingTextResult)}`);

  // Get Started Button
  const getStarted = new GetStartedButton('start');
  const getStartedResult = await messenger.setThreadSetting(getStarted);
  console.log(`Greeting Text: ${JSON.stringify(getStartedResult)}`);

  // Persistent menu
  const menu_help = new PersistentMenuItem({
    type: 'postback',
    title: 'Help',
    payload: 'help',
  });

  const menu_docs = new PersistentMenuItem({
    type: 'web_url',
    title: 'Messenger Docs',
    url: 'https://developers.facebook.com/docs/messenger-platform',
  });

  const menu = new PersistentMenu([menu_help, menu_docs]);
  const persistentMenuResult = await messenger.setThreadSetting(menu);
  console.log(`Greeting Text: ${JSON.stringify(persistentMenuResult)}`);
}

function get_button(ratio) {
  return new Button({
    type: 'web_url',
    title: 'Stack Overflow',
    url: 'https://357f6bc9.ngrok.io/share',
    webview_height_ratio: ratio,
  });
}

function get_element(btn) {
  return new Element({
    title: 'Template example',
    item_url: 'https://stackoverflow.com',
    image_url: 'http://placehold.it/300x300',
    subtitle: 'Subtitle',
    buttons: [btn],
  });
}

messenger.on('message', async (message) => {
  console.log(`Message received: ${JSON.stringify(message)}`);

  // Allow receiving locations
  if ('attachments' in message.message) {
    const msgType = message.message.attachments[0].type;
    if (msgType === 'location') {
      console.log('Location received');
      const text = `${message.message.attachments[0].title}:
                    lat: ${message.message.attachments[0].payload.coordinates.lat},
                    long: ${message.message.attachments[0].payload.coordinates.long}`;
      messenger.send({ text });
    }

    if (['audio', 'video', 'image', 'file'].includes(msgType)) {
      const attachment = message.message.attachments[0].payload.url;
      console.log(`Attachment received: ${attachment}`);
    }
  }

  // Text messages
  if ('text' in message.message) {
    let msg = message.message.text;
    msg = msg.toLowerCase();

    if (msg.includes('text')) {
      messenger.send({ text: 'This is an example text message.' });
    }

    if (msg.includes('image')) {
      messenger.send(new Image({
        url: 'https://unsplash.it/300/200/?random',
        is_reusable: true,
      }))
        .then((res) => {
          console.log(`Resuable attachment ID: ${res.attachment_id}`);
        });
    }

    if (msg.includes('reuse')) {
      messenger.send(new Image({ attachment_id: 947782652018100 }));
    }

    if (msg.includes('video')) {
      messenger.send(new Video({ url: 'http://techslides.com/demos/sample-videos/small.mp4' }));
    }

    if (msg.includes('payload')) {
      const pl = message.message.quick_reply.payload;
      const text = `User clicked button: ${msg}, Button payload is: ${pl}`;
      messenger.send({ text });
    }

    if (msg.includes('bubble')) {
      messenger.send(new GenericTemplate(
        [
          new Element({
            title: 'Example bubble',
            item_url: 'http://www.bbc.co.uk',
            image_url: 'https://unsplash.it/300/200/?random',
            subtitle: 'Opens bbc.co.uk',
            buttons: [
              new Button({
                type: 'web_url',
                title: 'BBC',
                url: 'http://www.bbc.co.uk',
              }),
            ],
          }),
        ]
      ));
    }

    if (msg.includes('quick replies')) {
      const qr1 = new QuickReply({ title: 'Location', content_type: 'location' });
      const qr2 = new QuickReply({ title: 'Payload', payload: 'QUICK_REPLY_PAYLOAD' });
      const qrs = new QuickReplies([qr1, qr2]);
      messenger.send(Object.assign(
        { text: 'This is an example with quick replies.' },
        qrs
      ));
    }

    if (msg.includes('compact')) {
      const btn = get_button('compact');
      const elem = get_element(btn);
      messenger.send(new GenericTemplate([elem]));
    }

    if (msg.includes('tall')) {
      const btn = get_button('tall');
      const elem = get_element(btn);
      messenger.send(new GenericTemplate([elem]));
    }

    if (msg.includes('full')) {
      const btn = get_button('full');
      const elem = get_element(btn);
      messenger.send(new GenericTemplate([elem]));
    }

    if (msg.includes('multiple')) {
      await messenger.send({ text: 'Message 1' });
      await timeout(3000);
      await messenger.send({ text: 'Message 2' });
    }

    if (msg.includes('receipt')) {
      const template = new ReceiptTemplate({
        recipient_name: 'Name',
        order_number: '123',
        currency: 'USD',
        payment_method: 'Visa',
        order_url: 'http://www.example.com',
        timestamp: '123123123',
        elements: [
          new Element({
            title: 'Title',
            subtitle: 'Subtitle',
            quantity: 1,
            price: 12.50,
            currency: 'USD',
          }),
        ],
        address: new Address({
          street_1: '1 Hacker Way',
          street_2: '',
          city: 'Menlo Park',
          postal_code: '94025',
          state: 'CA',
          country: 'US',
        }),
        summary: new Summary({
          subtotal: 75.00,
          shipping_cost: 4.95,
          total_tax: 6.19,
          total_cost: 56.14,
        }),
        adjustments: [
          new Adjustment({
            name: 'Adjustment',
            amount: 20,
          }),
        ],
      });
      messenger.send(template)
        .then((res) => {
          console.log(res);
        });
    }
  }
});

messenger.on('delivery', () => {
  // console.log(messenger.lastEntry);
});

messenger.on('postback', (message) => {
  const payload = message.postback.payload;
  console.log(payload);

  if (payload === 'help') {
    messenger.send({ text: 'A help message or template can go here.' });
  } else if (payload === 'start') {
    const text = 'Try sending me one of these messages: text, image, video, reuse, bubble, "quick replies", compact, tall, full';
    messenger.send({ text });
  }
});

messenger.on('read', () => {
  // console.log(messenger.lastEntry);
});

messenger.on('optin', () => {
  // console.log(messenger.lastEntry);
});

messenger.on('account_linking', () => {
  // console.log(messenger.lastEntry);
});

app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(400);
  }
});

app.get('/init', (req, res) => {
  init_bot();
  res.sendStatus(200);
});

app.post('/webhook', (req, res) => {
  res.sendStatus(200);
  messenger.handle(req.body);
});

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});
