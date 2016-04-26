import dotenv from 'dotenv';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';

import {
  MessengerWrapper,
  MessengerText,
  MessengerImage,
  MessengerButton,
  MessengerBubble,
  MessengerAddress,
  MessengerSummary,
  MessengerAdjustment,
  MessengerButtonTemplate,
  MessengerGenericTemplate,
  MessengerReceiptTemplate
} from '../lib/messenger-wrapper';

dotenv.config();

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let messenger = new MessengerWrapper({
  verifyToken:     process.env.VERIFY_TOKEN,
  pageAccessToken: process.env.PAGE_ACCESS_TOKEN
});

messenger.on('message', () => {
  messenger.send(new MessengerButtonTemplate(
    'Hey user! Watch these buttons:',
    [
      new MessengerButton({ title: 'Web Url Button', url: 'http://www.example.com' }),
      new MessengerButton({ title: 'Postback Button', payload: 'POSTBACK_INFO' })
    ]
  ));
});

messenger.on('delivery', () => {
  // console.log(wrapper.lastEntry);
});

messenger.on('postback', () => {
  // console.log(wrapper.lastEntry);
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

http.createServer(app).listen(3000);
