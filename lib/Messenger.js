import EventEmitter from 'events';

import MessengerClient from './MessengerClient';

import Text from './elements/Text';
import Button from './elements/Button';
import Address from './elements/Address';
import Element from './elements/Element';
import Summary from './elements/Summary';
import Adjustment from './elements/Adjustment';
import Image from './attachments/Image';
import Audio from './attachments/Audio';
import Video from './attachments/Video';
import File from './attachments/File';

import ButtonTemplate from './templates/ButtonTemplate';
import GenericTemplate from './templates/GenericTemplate';
import ReceiptTemplate from './templates/ReceiptTemplate';

class Messenger extends EventEmitter {
  constructor(pageAccessToken) {
    super();

    if (!pageAccessToken) {
      throw new Error('PAGE_ACCESS_TOKEN is missing.');
    }

    this.pageAccessToken = pageAccessToken;
    this.client = new MessengerClient(this.pageAccessToken);
    this.lastMessage = {};
  }

  handle(payload) {
    let entries = payload.entry;
    entries.forEach(entry => {
      entry.messaging.forEach(message => {
        if (message.message) {
          this.handleEvent('message', message);
        }
        if (message.delivery) {
          this.handleEvent('delivery', message);
        }
        if (message.read) {
          this.handleEvent('read', message);
        }
        if (message.postback) {
          this.handleEvent('postback', message);
        }
        if (message.account_linking) {
          this.handleEvent('account_linking', message);
        }
        if (message.optin) {
          this.handleEvent('optin', message);
        }
      });
    });
  }

  handleEvent(event, message) {
    this.lastMessage = message;
    this.emit(event, message);
  }

  getUser() {
    return this.client.getUser(this.lastMessage.sender.id);
  }

  send(payload) {
    return this.client.send(payload, this.lastMessage.sender.id);
  }

}

export {
  Messenger,
  Text,
  Button,
  Address,
  Summary,
  Adjustment,
  Element,
  Image,
  Audio,
  Video,
  File,
  ButtonTemplate,
  GenericTemplate,
  ReceiptTemplate
};
