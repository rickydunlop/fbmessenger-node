import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';

import MessengerWrapper from '../index.js';

let app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendStatus(200);
});

http.createServer(app).listen(3000);
