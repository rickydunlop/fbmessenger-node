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
  PersistentMenuItem,
  PersistentMenu,
  QuickReply,
  QuickReplies,
  ReceiptTemplate,
  ListTemplate,
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

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

async function initBot() {
  try {
    messenger.setDomainWhitelist(WHITELISTED_DOMAINS);

    // Greeting Text
    const greetingText = new GreetingText({ text: 'Welcome to the bot demo.' });
    const greetingTextResult = await messenger.setGreetingText(greetingText);
    console.log(`Greeting Text: ${JSON.stringify(greetingTextResult)}`);

    // Get Started Button
    const getStartedResult = await messenger.setGetStarted('START');
    console.log(`Get Started: ${JSON.stringify(getStartedResult)}`);

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

    const menu = new PersistentMenu({
      locale: 'default',
      call_to_actions: [menuHelp, menuDocs],
    });
    const persistentMenuResult = await messenger.setPersistentMenu(menu);
    console.log(`PersistentMenu: ${JSON.stringify(persistentMenuResult)}`);
  } catch (e) {
    console.log(e);
  }
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

messenger.on('message', async (message) => {
  console.log(`Message received: ${JSON.stringify(message, true)}`);
  const recipient = message.sender.id;

  // Allow receiving locations
  if ('attachments' in message.message) {
    const msgType = message.message.attachments[0].type;
    if (msgType === 'location') {
      console.log('Location received');
      const text = `${message.message.attachments[0].title}:
                    lat: ${message.message.attachments[0].payload.coordinates.lat},
                    long: ${message.message.attachments[0].payload.coordinates.long}`;
      await messenger.send({ text }, recipient);
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
      await messenger.send({ text: 'This is an example text message.' }, recipient);
    }

    if (msg.includes('image')) {
      const res = await messenger.send(new Image({
        url: 'https://unsplash.it/300/200/?random',
        is_reusable: true,
      }), recipient);
      console.log(`Resuable attachment ID: ${res.attachment_id}`);
    }

    if (msg.includes('reuse')) {
      await messenger.send(new Image({ attachment_id: 947782652018100 }), recipient);
    }

    if (msg.includes('video')) {
      try {
        await messenger.send(new Video({
          url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        }), recipient);
      } catch (e) {
        console.error(e);
      }
    }

    if (msg.includes('payload')) {
      const pl = message.message.quick_reply.payload;
      const text = `User clicked button: ${msg}, Button payload is: ${pl}`;
      await messenger.send({ text }, recipient);
    }

    if (msg.includes('code')) {
      const result = await messenger.messengerCode();
      await messenger.send({ text: result.uri }, recipient);
    }

    if (msg.includes('list')) {
      const element1 = new Element({
        title: 'BBC news',
        subtitle: 'Catch up on the latest news',
        image_url: 'https://unsplash.it/300/200/?random',
        default_action: {
          type: 'web_url',
          url: 'https://bbc.co.uk/news',
        },
      });
      const element2 = new Element({
        title: 'BBC weather',
        subtitle: 'See the weather forecast',
        default_action: {
          type: 'web_url',
          url: 'https://bbc.co.uk/weather',
        },
      });
      const elements = [element1, element2];
      const template = new ListTemplate({
        top_element_style: 'large',
        elements,
      });
      await messenger.send(template, recipient);
    }

    if (msg.includes('bubble')) {
      const element = new Element({
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
      });
      await messenger.send(new GenericTemplate({
        elements: [element],
      }), recipient);
    }

    if (msg.includes('quick replies')) {
      const qr1 = new QuickReply({ title: 'Location', content_type: 'location' });
      const qr2 = new QuickReply({ title: 'Payload', payload: 'QUICK_REPLY_PAYLOAD' });
      const qrs = new QuickReplies([qr1, qr2]);
      await messenger.send(Object.assign(
        { text: 'This is an example with quick replies.' },
        qrs,
      ), recipient);
    }

    if (msg.includes('compact')) {
      const btn = getButton('compact');
      const elem = getElement(btn);
      await messenger.send(new GenericTemplate([elem]), recipient);
    }

    if (msg.includes('tall')) {
      const btn = getButton('tall');
      const elem = getElement(btn);
      await messenger.send(new GenericTemplate([elem]), recipient);
    }

    if (msg.includes('full')) {
      const btn = getButton('full');
      const elem = getElement(btn);
      await messenger.send(new GenericTemplate([elem]), recipient);
    }

    if (msg.includes('multiple')) {
      await messenger.send({ text: 'Message 1' }, recipient);
      await timeout(3000);
      await messenger.send({ text: 'Message 2' }, recipient);
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
      const res = await messenger.send(template, recipient);
      console.log(res);
    }
  }
});

messenger.on('delivery', () => {
  // console.log(messenger.lastEntry);
});

messenger.on('postback', (message) => {
  const recipient = message.sender.id;
  const { payload } = message.postback;
  console.log(payload);

  if (payload === 'help') {
    messenger.send({ text: 'A help message or template can go here.' }, recipient);
  } else if (payload === 'START') {
    const text = 'Try sending me one of these messages: text, image, video, reuse, bubble, "quick replies", compact, tall, full';
    messenger.send({ text }, recipient);
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
