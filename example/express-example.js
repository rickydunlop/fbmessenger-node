import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';

import {
  Messenger,
  Text,
  Button,
  Element,
  GenericTemplate,
} from '../lib/Messenger';

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let messenger = new Messenger({
  pageAccessToken: process.env.PAGE_ACCESS_TOKEN
});

messenger.on('message', (message) => {
  console.log(`Message received: ${JSON.stringify(message)}`);
  messenger.send(new GenericTemplate(
    [
      new Element({
        title: 'Title',
        item_url: 'http://www.example.com',
        image_url: 'http://www.example.com',
        subtitle: 'Subtitle',
        buttons: [
          new Button({ type: 'web_url', title: 'Button', url: 'http://www.example.com' })
        ]
      })
    ]
  ));
});

messenger.on('delivery', () => {
  // console.log(messenger.lastEntry);
});

messenger.on('postback', () => {
  // console.log(messenger.lastEntry);
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

app.post('/webhook', (req, res) => {
  res.sendStatus(200);
  messenger.handle(req.body);
});

http.createServer(app).listen(3000);
