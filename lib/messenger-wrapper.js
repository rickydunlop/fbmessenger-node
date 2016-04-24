import EventEmitter from 'events';

import MessengerClient from './messenger-client';

class MessengerWrapper extends EventEmitter {
  constructor(opts) {
    super();

    opts = opts || {};

    if (!opts.verifyToken || !opts.pageAccessToken) {
      throw new Error('VERIFY_TOKEN or PAGE_ACCESS_TOKEN are missing.');
    }

    this.verifyToken = opts.verifyToken;
    this.pageAccessToken = opts.pageAccessToken;
    this.messengerClient = new MessengerClient(this);
  }

  verify(req, res) {
    if (req.query['hub.verify_token'] === this.verifyToken) {
      return res.send(req.query['hub.challenge']);
    } else {
      return res.send('VERIFY_TOKEN does not match.');
    }
  }

  handle(req) {
    let entries = req.body.entry;

    entries.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message) {
          this.handleEvent('message', event);
        }
        else if (event.delivery) {
          this.handleEvent('delivery', event);
        }
        else if (event.postback) {
          this.handleEvent('postback', event);
        }
      });
    });
  }

  handleEvent(action, event) {
    this.emit(action, event);
  }

  getUser(event) {
    if (typeof event === 'object') {
      return this.messengerClient.getUserData(event.sender.id);
    } else {
      return this.messengerClient.getUserData(event);
    }
  }

  sendData(payload, event) {
    if (typeof event === 'object') {
      return this.messengerClient.sendData(payload, event.sender.id)
    } else {
      return this.messengerClient.sendData(payload, event);
    }
  }

  subscribe() {
    return this.messengerClient.subscribeAppToPage();
  }
}

export default MessengerWrapper;
