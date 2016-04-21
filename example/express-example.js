import dotenv from 'dotenv';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';

dotenv.config();

import MessengerWrapper from '../messenger-wrapper.js';

let app = express();

let wrapper = new MessengerWrapper({
  verifyToken: process.env.VERIFY_TOKEN,
  pageAccessToken: process.env.PAGE_ACCESS_TOKEN
});

wrapper.on('message', (event) => {
  wrapper.getUser(event).then((user) => {
    console.log(user);
  });
});

wrapper.on('delivery', (event) => {
  console.log('delivery has come');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/webhook', (req, res) => {
  return wrapper.verify(req, res);
});

app.post('/webhook', (req, res) => {
  res.sendStatus(200);
  wrapper.handle(req);
});

http.createServer(app).listen(3000);
