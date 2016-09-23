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

dotenv.config({ silent: true });

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const messenger = new Messenger({
  pageAccessToken: process.env.PAGE_ACCESS_TOKEN,
});

const WHITELISTED_DOMAINS = [
  'https://bbc.co.uk',
  'https://stackoverflow.com',
];

function init_bot() {
  messenger.addWhitelistedDomains(WHITELISTED_DOMAINS);

  // Greeting Text
  const greetingText = new GreetingText('Welcome to the bot demo.');
  messenger.setThreadSetting(greetingText)
    .then((result) => {
      console.log(`Greeting Text: ${JSON.stringify(result)}`);
    });

  // Get Started Button
  const getStarted = new GetStartedButton('start');
  messenger.setThreadSetting(getStarted)
    .then((result) => {
      console.log(`Greeting Text: ${JSON.stringify(result)}`);
    });

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
  messenger.setThreadSetting(menu)
    .then((result) => {
      console.log(`Greeting Text: ${JSON.stringify(result)}`);
    });
}

function get_button(ratio) {
  return new Button({
    type: 'web_url',
    title: 'Stack Overflow',
    url: 'https://stackoverflow.com',
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

messenger.on('message', (message) => {
  console.log(`Message received: ${JSON.stringify(message)}`);

  // Allow receiving locations
  if ('attachments' in message.message) {
    if (message.message.attachments[0].type === 'location') {
      console.log('Location received');
      const text = `${message.message.attachments[0].title}:
                    lat: ${message.message.attachments[0].payload.coordinates.lat},
                    long: ${message.message.attachments[0].payload.coordinates.long}`;
      messenger.send({ text });
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
      messenger.send(new Image({ url: 'https://unsplash.it/300/200/?random' }));
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
    console.log('Help payload');
    messenger.send({ text: 'A help message or template can go here.' })
      .then((res) => {
        console.log(res);
      });
  } else if (payload === 'start') {
    const text = `Hey, let's get started! Try sending me one of these messages:
    text, image, video, "quick replies", compact, tall, full`;
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
