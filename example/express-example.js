import dotenv from 'dotenv';
import crypto from 'crypto';
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
} from '../src/Messenger';

dotenv.config({ silent: true });

const app = express();

const verifyRequestSignature = (req, res, buf) => {
  const signature = req.headers['x-hub-signature'];

  if (!signature) {
    throw new Error('Couldn\'t validate the signature.');
  } else {
    const elements = signature.split('=');
    const signatureHash = elements[1];
    const expectedHash = crypto.createHmac('sha1', process.env.APP_SECRET)
                          .update(buf)
                          .digest('hex');

    if (signatureHash !== expectedHash) {
      throw new Error('Couldn\'t validate the request signature.');
    }
  }
};

app.use(bodyParser.json({ verify: verifyRequestSignature }));
app.use(bodyParser.urlencoded({ extended: true }));

const messenger = new Messenger({
  pageAccessToken: process.env.PAGE_ACCESS_TOKEN,
});

const WHITELISTED_DOMAINS = [
  'https://bbc.co.uk',
  'https://stackoverflow.com',
];

const INTRO_MESSAGE = `Try sending me one of these messages:
text, image, video, reuse, bubble,
"quick replies", compact, tall, full`;

function initBot() {
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
  const menuHelp = new PersistentMenuItem({
    type: 'postback',
    title: 'Help',
    payload: 'help',
  });

  const menuDocs = new PersistentMenuItem({
    type: 'web_url',
    title: 'Messenger Docs',
    url: 'https://developers.facebook.com/docs/messenger-platform',
  });

  const menu = new PersistentMenu([menuHelp, menuDocs]);
  messenger.setThreadSetting(menu)
    .then((result) => {
      console.log(`Greeting Text: ${JSON.stringify(result)}`);
    });
}

function getButton(ratio) {
  return new Button({
    type: 'web_url',
    title: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    webview_height_ratio: ratio,
  });
}

function getElement(btn) {
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
  const sender = message.sender.id;

  // Allow receiving locations
  if ('attachments' in message.message) {
    const msgType = message.message.attachments[0].type;
    if (msgType === 'location') {
      console.log('Location received');
      const text = `${message.message.attachments[0].title}:
                    lat: ${message.message.attachments[0].payload.coordinates.lat},
                    long: ${message.message.attachments[0].payload.coordinates.long}`;
      messenger.send({ text }, sender);
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
      messenger.send({ text: 'This is an example text message.' }, sender);
    }

    if (msg.includes('image')) {
      messenger.send(new Image({
        url: 'https://unsplash.it/300/200/?random',
        is_reusable: true,
      }), sender)
        .then((res) => {
          console.log(`Resuable attachment ID: ${res.attachment_id}`);
        });
    }

    if (msg.includes('reuse')) {
      messenger.send(new Image({ attachment_id: 947782652018100 }), sender);
    }

    if (msg.includes('video')) {
      messenger.send(new Video({
        url: 'http://techslides.com/demos/sample-videos/small.mp4',
      }), sender);
    }

    if (msg.includes('payload')) {
      const pl = message.message.quick_reply.payload;
      const text = `User clicked button: ${msg}, Button payload is: ${pl}`;
      messenger.send({ text }, sender);
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
        ],
      ), sender);
    }

    if (msg.includes('quick replies')) {
      const qr1 = new QuickReply({ title: 'Location', content_type: 'location' });
      const qr2 = new QuickReply({ title: 'Payload', payload: 'QUICK_REPLY_PAYLOAD' });
      const qrs = new QuickReplies([qr1, qr2]);
      const qr = Object.assign(
        { text: 'This is an example with quick replies.' },
        qrs,
      );
      messenger.send(qr, sender);
    }

    if (msg.includes('compact')) {
      const btn = getButton('compact');
      const elem = getElement(btn);
      messenger.send(new GenericTemplate([elem]), sender);
    }

    if (msg.includes('tall')) {
      const btn = getButton('tall');
      const elem = getElement(btn);
      messenger.send(new GenericTemplate([elem]), sender);
    }

    if (msg.includes('full')) {
      const btn = getButton('full');
      const elem = getElement(btn);
      messenger.send(new GenericTemplate([elem]), sender);
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
      messenger.send(template, sender)
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
  const sender = message.sender.id;

  console.log(payload);
  if (payload === 'help') {
    console.log('Help payload');
    messenger.send({ text: 'A help message or template can go here.' }, sender)
      .then((res) => {
        console.log(res);
      });
  } else if (payload === 'start') {
    messenger.send({ INTRO_MESSAGE }, sender);
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
  initBot();
  res.sendStatus(200);
});

app.post('/webhook', (req, res) => {
  res.sendStatus(200);
  messenger.handle(req.body);
});

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});
