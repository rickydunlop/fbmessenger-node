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
  PersistentMenuItem,
} from './ThreadSettings';


class Messenger extends EventEmitter {
  constructor(opts = {}) {
    super();

    if (!Object.prototype.hasOwnProperty.call(opts, 'pageAccessToken')) {
      throw new Error('PAGE_ACCESS_TOKEN is missing.');
    }

    this.pageAccessToken = opts.pageAccessToken;
    this.client = new MessengerClient(this.pageAccessToken);
    this.lastMessage = {};
  }

  handle(payload) {
    const entries = payload.entry;
    entries.forEach((entry) => {
      entry.messaging.forEach((message) => {
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

  send(payload, id = '') {
    let userId = id;
    if (!id) {
      userId = this.lastMessage.sender.id;
    }
    return this.client.send(payload, userId);
  }

  senderAction(senderAction) {
    const userId = this.lastMessage.sender.id;
    return this.client.senderAction(senderAction, userId);
  }

  setThreadSetting(payload) {
    return this.client.setThreadSetting(payload);
  }

  subscribeAppToPage() {
    return this.client.subscribeAppToPage();
  }

  deleteGreetingText() {
    return this.client.deleteGreetingText();
  }

  deleteGetStarted() {
    return this.client.deleteGetStarted();
  }

  deletePersistentMenu() {
    return this.client.deletePersistentMenu();
  }

  linkAccount(accountLinkingToken) {
    return this.client.linkAccount(accountLinkingToken);
  }

  unlinkAccount(self, psid) {
    return this.client.unlinkAccount(psid);
  }

  addWhitelistedDomain(self, domain) {
    return this.client.updateWhitelistedDomains('add', [domain]);
  }

  addWhitelistedDomains(self, domains) {
    return this.client.updateWhitelistedDomains('add', domains);
  }

  removeWhitelistedDomain(self, domain) {
    return this.client.updateWhitelistedDomains('remove', [domain]);
  }

  removeWhitelistedDomains(self, domains) {
    return this.client.updateWhitelistedDomains('remove', domains);
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
  PersistentMenuItem,
};
