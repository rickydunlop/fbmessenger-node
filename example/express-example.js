import dotenv from 'dotenv';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';

import MessengerWrapper from '../lib/messenger-wrapper.js';

dotenv.config();

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let wrapper = new MessengerWrapper({
  verifyToken:     process.env.VERIFY_TOKEN,
  pageAccessToken: process.env.PAGE_ACCESS_TOKEN
});

wrapper.on('message', () => {
  wrapper.getUser().then((user) => {
    wrapper.send({ text: user.first_name });
  });
});

wrapper.on('delivery', () => {
  // console.log(wrapper.lastEntry);
});

wrapper.on('postback', () => {
  // console.log(wrapper.lastEntry);
});

app.get('/webhook', (req, res) => {
  wrapper.verify(req, res);
});

app.get('/subscribe', (req, res) => {
  wrapper.subscribe().then((response) => {
    res.send(response.body);
  });
});

app.post('/webhook', (req, res) => {
  res.sendStatus(200);
  wrapper.handle(req);
});

http.createServer(app).listen(3000);
