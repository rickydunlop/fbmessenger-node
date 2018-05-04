import EventEmitter from 'events';

import axios from 'axios';

import {
  Text,
  Button,
  Address,
  Element,
  Summary,
  Adjustment,
  DefaultAction,
} from './elements';

import {
  Image,
  Audio,
  Video,
  File,
} from './attachments';

import {
  ButtonTemplate,
  GenericTemplate,
  ReceiptTemplate,
  ListTemplate,
} from './templates';

import {
  FB_API_VERSION,
  SENDER_ACTIONS,
  GET_STARTED_LIMIT,
  WHITELISTED_DOMAIN_MAX,
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
} from './messenger_profile';

class Messenger extends EventEmitter {
  constructor(opts = {}) {
    super();

    if (!Object.prototype.hasOwnProperty.call(opts, 'pageAccessToken')) {
      throw new Error('PAGE_ACCESS_TOKEN is missing.');
    }

    this.pageAccessToken = opts.pageAccessToken;
    this.api = axios.create({
      baseURL: `https://graph.facebook.com/${FB_API_VERSION}`,
      params: {
        access_token: this.pageAccessToken,
      },
    });
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
            case 2018034:
              throw new Error('Message cannot be empty.');
            default:
              throw new Error(result.error.message);
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
              throw new Error(result.error.message || 'Unknown error occurred.');
          }
        case 190:
          throw new Error('Invalid OAuth access token.');
        case 10303:
          throw new Error('Invalid account_linking_token.');
        default:
          throw new Error(result.error.message || 'Unknown error occurred.');
      }
    }
    return result;
  }

  async get(url, config = {}) {
    const res = await this.api.get(url, config);
    return this.constructor.handleError(res.data);
  }

  async post(url, config = {}) {
    const params = Object.assign({ method: 'post' }, config);
    const res = await this.api.request(url, params);
    return this.constructor.handleError(res.data);
  }

  async delete(url, config) {
    const res = await this.api.delete(url, config);
    return this.constructor.handleError(res.data);
  }

  getUser(id) {
    if (!id) {
      throw new Error('A user ID is required.');
    }

    const params = [
      'first_name',
      'last_name',
      'profile_pic',
      'locale',
      'timezone',
      'gender',
      'is_payment_enabled',
      'last_ad_referral',
    ].join();

    return this.get(`/${id}`, { params });
  }

  send(payload, id, tag = null) {
    if (!id) {
      throw new Error('A user ID is required.');
    }

    const data = {
      recipient: { id },
      message: payload,
    };

    if (tag) {
      data.tag = tag;
    }

    return this.post('/me/messages', { data });
  }

  senderAction(senderAction, id) {
    if (SENDER_ACTIONS.indexOf(senderAction) === -1) {
      throw new Error('Invalid sender_action provided.');
    }

    if (!id) {
      throw new Error('A user ID is required.');
    }

    const data = {
      recipient: { id },
      sender_action: senderAction,
    };

    return this.post('/me/messages', { data });
  }

  messageAttachment(payload) {
    const data = {
      message: payload,
    };
    return this.post('/me/message_attachments', { data });
  }

  messengerCode({ type = 'standard', image_size = 1000, ref = '' } = {}) {
    if (image_size < 100 || image_size > 2000) {
      throw new Error('Size Supported range: 100-2000 px');
    }

    const data = {
      type,
      image_size,
    };

    if (ref) {
      const isValid = /^[\w+/=\-.:]{1,250}$/.test(ref);
      if (!isValid) {
        throw new Error(`Invalid ref provided: ${ref}`);
      }
      data.data = { ref };
    }

    return this.post('/me/messenger_codes', { data });
  }

  /**
   * Enable/Disable NLP
   * @param {boolean} value True or false
   */
  setNLP(value, custom_token = '') {
    const nlp_enabled = Boolean(value);
    const params = { nlp_enabled };
    if (custom_token) {
      params.custom_token = custom_token;
    }
    return this.post('/me/nlp_configs', { params });
  }

  /**
  * Subscribes an app to a page
  * @return {Object} JSON Response object
  */
  subscribeAppToPage() {
    return this.post('/me/subscribed_apps');
  }

  /**
   * Read multiple Messenger Profile properties at the same time
   * @param  {Mixed} props Array or comma separated list of properties to read
   * @return {Object} JSON Response object
   */
  getMessengerProfile(props) {
    let fields = props;
    if (Array.isArray(props)) {
      fields = props.join();
    }
    return this.get('/me/messenger_profile', { params: { fields } });
  }

  /**
   * Set multiple Messenger Profile properties at the same time
   * @param {Array} data Property names and their new settings
   * @return {Object} JSON Response object
   */
  setMessengerProfile(data) {
    return this.post('/me/messenger_profile', { data });
  }

  /**
   * Delete multiple Messenger Profile properties at the same time
   * @param  {Array} payload Properties to be deleted
   * @return {Object} JSON Response object
   */
  deleteMessengerProfile(fields) {
    let data = fields;
    if (!Array.isArray(fields)) {
      data = [fields];
    }

    return this.delete('/me/messenger_profile', { data });
  }

  /**
   * Ses the Get Started Button
   * @param {string} payload Payload that will be sent back to your webhook
   * @return {Object} JSON Response object
   */
  setGetStarted(payload) {
    if (payload.length > GET_STARTED_LIMIT) {
      throw new Error(`Get Started payload limit is ${GET_STARTED_LIMIT}.`);
    }
    const data = { get_started: { payload } };
    return this.setMessengerProfile(data);
  }

  /**
   * Deletes the get started button
   * @return {Object} JSON Response object
   */
  deleteGetStarted() {
    return this.deleteMessengerProfile(['get_started']);
  }

  /**
   * Sets the Greeting Text
   * @param {Array} greetings Array of Greeting text objects
   * @return {Object} JSON Response object
   */
  setGreetingText(greetings) {
    let payload = greetings;
    if (!Array.isArray(greetings)) {
      payload = [greetings];
    }

    const hasDefault = payload.some(x => x.locale === 'default');
    if (!hasDefault) {
      throw new Error('You must provide a default locale');
    }
    const data = { greeting: payload };
    return this.setMessengerProfile(data);
  }

  /**
   * Deletes the greeting text
   * @return {Object} JSON Response object
   */
  deleteGreetingText() {
    return this.deleteMessengerProfile(['greeting']);
  }

  /**
   * Sets whitelisted domains
   * @param {Array} payload Domains to whitelist
   * @return {Object} JSON Response object
   */
  setDomainWhitelist(payload) {
    if (!payload) {
      throw new Error('A domain must be provided.');
    }
    if (payload.length > WHITELISTED_DOMAIN_MAX) {
      throw new Error(`You may only whitelist ${WHITELISTED_DOMAIN_MAX} domains.`);
    }
    const data = { whitelisted_domains: payload };
    return this.setMessengerProfile(data);
  }

  /**
   * Deletes whitelisted domains
   * @return {Object} JSON Response object
   */
  deleteDomainWhitelist() {
    return this.deleteMessengerProfile(['whitelisted_domains']);
  }

  /**
   * Sets the persistent menu
   * @param {Object} menus PersistentMenu settings
   * @return {Object} JSON Response object
   */
  setPersistentMenu(menus) {
    let payload = menus;
    if (!Array.isArray(menus)) {
      payload = [menus];
    }

    const hasDefault = payload.some(x => x.locale === 'default');
    if (!hasDefault) {
      throw new Error('You must provide a default locale');
    }

    const data = { persistent_menu: payload };
    return this.setMessengerProfile(data);
  }

  /**
   * Deletes the persistent menu
   * @return {Object} JSON Response object
   */
  deletePersistentMenu() {
    return this.deleteMessengerProfile(['persistent_menu']);
  }

  /**
   * Sets an account linking url
   * @param {string} payload Account linking URL
   * @return {Object} JSON Response object
   */
  setAccountLinkingURL(payload) {
    if (!payload) {
      throw new Error('A URL must be provided.');
    }
    const data = { account_linking_url: payload };
    return this.setMessengerProfile(data);
  }

  /**
   * Deletes the account linking URL
   * @return {Object} JSON Response object
   */
  deleteAccountLinkingURL() {
    return this.deleteMessengerProfile(['account_linking_url']);
  }

  /**
   * Sets payment settings
   * @param {Object} payload Target Audience settings
   * @return {Object} JSON Response object
   */
  setPaymentSettings(payload) {
    if (!payload) {
      throw new Error('Payment settings must be provided.');
    }
    const data = { payment_settings: payload };
    return this.setMessengerProfile(data);
  }

  /**
   * Deletes payment settings
   * @return {Object} JSON Response object
   */
  deletePaymentSettings() {
    return this.deleteMessengerProfile(['payment_settings']);
  }

  /**
   * Sets the target audience
   * @param {Object} payload Target Audience settings
   * @return {Object} JSON Response object
   */
  setTargetAudience(payload) {
    if (!payload) {
      throw new Error('A target audience must be provided.');
    }
    const data = { target_audience: payload };
    return this.setMessengerProfile(data);
  }
  /**
   * Deletes the target audience
   * @return {Object} JSON Response object
   */
  deleteTargetAudience() {
    return this.deleteMessengerProfile(['target_audience']);
  }

  /**
   * Sets the home url
   * See: https://developers.facebook.com/docs/messenger-platform/messenger-profile/home-url
   * @param {Object} payload Home URL settings
   * @return {Object} JSON Response object
   */
  setHomeURL(payload) {
    if (!payload) {
      throw new Error('A URL must be provided.');
    }
    const data = { home_url: payload };
    return this.setMessengerProfile(data);
  }

  /**
   * Deletes the home URL
   * @return {Object} JSON Response object
   */
  deleteHomeURL() {
    return this.deleteMessengerProfile(['home_url']);
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
