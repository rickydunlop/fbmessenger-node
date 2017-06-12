import EventEmitter from 'events';

import * as NodeUrl from 'url';
import fetch from 'node-fetch';

import Text from './elements/Text';
import Button from './elements/Button';
import Address from './elements/Address';
import Element from './elements/Element';
import Summary from './elements/Summary';
import Adjustment from './elements/Adjustment';
import DefaultAction from './elements/DefaultAction';
import Image from './attachments/Image';
import Audio from './attachments/Audio';
import Video from './attachments/Video';
import File from './attachments/File';

import ButtonTemplate from './templates/ButtonTemplate';
import GenericTemplate from './templates/GenericTemplate';
import ReceiptTemplate from './templates/ReceiptTemplate';
import ListTemplate from './templates/ListTemplate';

import {
  SENDER_ACTIONS,
} from './constants';

import {
  QuickReplies,
  QuickReply,
} from './QuickReplies';

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
  }

  handle(payload) {
    const entries = payload.entry;
    entries.forEach((entry) => {
      entry.messaging.forEach((message) => {
        if (message.message) {
          this.emit('message', message);
        }
        if (message.delivery) {
          this.emit('delivery', message);
        }
        if (message.read) {
          this.emit('read', message);
        }
        if (message.postback) {
          this.emit('postback', message);
        }
        if (message.account_linking) {
          this.emit('account_linking', message);
        }
        if (message.optin) {
          this.emit('optin', message);
        }
        if (message.referral) {
          this.emit('referral', message);
        }
        if (message.payment) {
          this.emit('payment', message);
        }
        if (message.checkout_update) {
          this.emit('checkout_update', message);
        }
        if (message.pre_checkout) {
          this.emit('pre_checkout', message);
        }
      });
    });
  }

  buildURL(pathname, queryParams) {
    const defaultqueryParams = {
      access_token: this.pageAccessToken,
    };
    const query = Object.assign({}, queryParams, defaultqueryParams);
    const obj = {
      protocol: 'https',
      host: 'graph.facebook.com',
      pathname: `/v2.8/${pathname}`,
      query,
    };

    return NodeUrl.format(obj);
  }

  static handleError(result) {
    /* istanbul ignore if */
    if ({}.hasOwnProperty.call(result, 'error')) {
      switch (result.error.code) {
        case 4:
          if (result.error.subcode === 2018022) {
            throw new Error('Too many send requests to phone numbers.');
          }
          break;
        case 1200:
          throw new Error('Temporary send message failure. Please try again later.');
        case 613:
          throw new Error('Calls to this API have exceeded the rate limit.');
        case 100:
          switch (result.error.subcode) {
            case 2018109:
              throw new Error('Attachment size exceeds allowable limit.');
            case 2018001:
              throw new Error('No matching user found.');
            default:
              throw new Error('Invalid fbid.');
          }
        case 10:
          switch (result.error.subcode) {
            case 2018065:
              throw new Error('This message is sent outside of allowed window. You need page_messaging_subscriptions permission to be able to do it.');
            case 2018108:
            default:
              throw new Error('This Person Cannot Receive Messages: This person isn\'t receiving messages from you right now.');
          }
        case 200:
          switch (result.error.subcode) {
            case 2018028:
              throw new Error('Cannot message users who are not admins, developers or testers of the app until pages_messaging permission is reviewed and the app is live.');
            case 2018027:
              throw new Error('Cannot message users who are not admins, developers or testers of the app until pages_messaging_phone_number permission is reviewed and the app is live.');
            case 2018021:
              throw new Error('Requires phone matching access fee to be paid by this page unless the recipient user is an admin, developer, or tester of the app.');
            default:
              break;
          }
          break;
        case 190:
          throw new Error('Invalid OAuth access token.');
        case 10303:
          throw new Error('Invalid account_linking_token.');
        default:
          throw new Error('Unknown error occurred.');
      }
    }
    return result;
  }

  get(url) {
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(res => this.constructor.handleError(res));
  }

  post(url, body = {}) {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    .then(response => response.json())
    .then(res => this.constructor.handleError(res));
  }

  delete(url, body) {
    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    .then(response => response.json())
    .then(res => this.constructor.handleError(res));
  }

  getUser(id) {
    if (!id) {
      throw new Error('A user ID is required.');
    }

    const url = this.buildURL(id, {
      fields: 'first_name,last_name,profile_pic,locale,timezone,gender,is_payment_enabled',
    });

    return this.get(url);
  }

  send(payload, id) {
    if (!id) {
      throw new Error('A user ID is required.');
    }

    const url = this.buildURL('me/messages');
    const body = {
      recipient: { id },
      message: payload,
    };

    return this.post(url, body);
  }

  senderAction(senderAction, id) {
    if (SENDER_ACTIONS.indexOf(senderAction) === -1) {
      throw new Error('Invalid sender_action provided.');
    }

    if (!id) {
      throw new Error('A user ID is required.');
    }

    const url = this.buildURL('me/messages');
    const body = {
      recipient: { id },
      sender_action: senderAction,
    };

    return this.post(url, body);
  }

  setThreadSetting(payload) {
    const url = this.buildURL('me/thread_settings');

    return this.post(url, payload);
  }

  subscribeAppToPage() {
    const url = this.buildURL('me/subscribed_apps');

    return this.post(url);
  }

  deleteThreadSetting(body) {
    const url = this.buildURL('me/thread_settings');

    return this.delete(url, body);
  }

  deleteGetStarted() {
    return this.deleteThreadSetting({
      setting_type: 'call_to_actions',
      thread_state: 'new_thread',
    });
  }

  deleteGreetingText() {
    return this.deleteThreadSetting({
      setting_type: 'greeting',
    });
  }

  deletePersistentMenu() {
    return this.deleteThreadSetting({
      setting_type: 'call_to_actions',
      thread_state: 'existing_thread',
    });
  }

  linkAccount(accountLinkingToken) {
    const url = this.buildURL('me', {
      fields: 'recipient',
      account_linking_token: accountLinkingToken,
    });

    return this.get(url);
  }

  unlinkAccount(psid) {
    const url = this.buildURL('me/unlink_accounts');
    const body = { psid };

    return this.post(url, body);
  }

  updateWhitelistedDomains(action_type, domains) {
    if (!Array.isArray(domains)) {
      throw new Error('An array of domains must be provided');
    }

    const url = this.buildURL('me/thread_settings');
    const body = {
      setting_type: 'domain_whitelisting',
      domain_action_type: action_type,
      whitelisted_domains: domains,
    };

    return this.post(url, body);
  }

  addWhitelistedDomain(domain) {
    if (!domain) {
      throw new Error('A domain must be provided');
    }

    return this.updateWhitelistedDomains('add', [domain]);
  }

  addWhitelistedDomains(domains) {
    if (!domains) {
      throw new Error('An array of domains must be provided');
    }

    return this.updateWhitelistedDomains('add', domains);
  }

  removeWhitelistedDomain(domain) {
    if (!domain) {
      throw new Error('A domain must be provided');
    }

    return this.updateWhitelistedDomains('remove', [domain]);
  }

  removeWhitelistedDomains(domains) {
    if (!domains) {
      throw new Error('An array of domains must be provided');
    }

    return this.updateWhitelistedDomains('remove', domains);
  }
}

export {
  Messenger,
  Text,
  Button,
  Address,
  Summary,
  Adjustment,
  DefaultAction,
  Element,
  Image,
  Audio,
  Video,
  File,
  ButtonTemplate,
  GenericTemplate,
  ReceiptTemplate,
  ListTemplate,
  QuickReplies,
  QuickReply,
  GreetingText,
  GetStartedButton,
  PersistentMenu,
  PersistentMenuItem,
};
