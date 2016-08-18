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

import { QuickReplies, QuickReply } from './QuickReplies';
import {
  GreetingText,
  GetStartedButton,
  PersistentMenu,
  PersistentMenuItem
} from './ThreadSettings';


class Messenger extends EventEmitter {
  constructor(opts = {}) {
    super();

    if (!opts.hasOwnProperty('pageAccessToken')) {
      throw new Error('PAGE_ACCESS_TOKEN is missing.');
    }

    this.pageAccessToken = opts.pageAccessToken;
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

  sender_action(sender_action) {
    return this.client.sender_action(sender_action, this.lastMessage.sender.id);
  }

  set_thread_setting(payload) {
    return this.client.set_thread_setting(payload);
  }

  subscribe_app_to_page() {
    return this.client.subscribe_app_to_page();
  }

  delete_get_started() {
    return this.client.delete_get_started();
  }

  link_account(account_linking_token) {
    return this.client.link_account(account_linking_token);
  }

  unlink_account(self, psid) {
    return this.client.unlink_account(psid);
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
  ReceiptTemplate,
  QuickReplies,
  QuickReply,
  GreetingText,
  GetStartedButton,
  PersistentMenu,
  PersistentMenuItem
};
