import url from 'url';
import fetch from 'node-fetch';

class MessengerClient {
  constructor(pageAccessToken) {
    this.pageAccessToken = pageAccessToken;
  }

  static buildURL(pathname, query) {
    const urlObject = {
      protocol: 'https',
      host: 'graph.facebook.com',
      pathname: `/v2.6/${pathname}`,
      query,
    };
    return url.format(urlObject);
  }

  getUser(id) {
    const finalUrl = this.constructor.buildURL(id, {
      fields: 'first_name,last_name,profile_pic,locale,timezone,gender',
      access_token: this.pageAccessToken,
    });

    return fetch(finalUrl)
      .then(response => response.json());
  }

  send(payload, id) {
    const finalUrl = this.constructor.buildURL('me/messages', {
      access_token: this.pageAccessToken,
    });
    return fetch(finalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: { id },
        message: payload,
      }),
    })
      .then(response => response.json());
  }

  subscribeAppToPage() {
    const finalUrl = this.constructor.buildURL('me/subscribed_apps', {
      access_token: this.pageAccessToken,
    });
    return fetch(finalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json());
  }

  setThreadSetting(payload) {
    const finalUrl = this.constructor.buildURL('me/thread_settings', {
      access_token: this.pageAccessToken,
    });
    return fetch(finalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json());
  }

  deleteThreadSetting(body) {
    const finalUrl = this.constructor.buildURL('me/thread_settings', {
      access_token: this.pageAccessToken,
    });
    return fetch(finalUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(response => response.json());
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
    const finalUrl = this.constructor.buildURL('me', {
      access_token: this.pageAccessToken,
      fields: 'recipient',
      account_linking_token: accountLinkingToken,
    });
    return fetch(finalUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json());
  }

  unlinkAccount(psid) {
    const finalUrl = this.constructor.buildURL('me/unlink_accounts', {
      access_token: this.pageAccessToken,
    });
    return fetch(finalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        psid,
      }),
    })
      .then(response => response.json());
  }

  senderAction(senderAction, id) {
    const actions = [
      'mark_seen',
      'typing_on',
      'typing_off',
    ];

    if (actions.indexOf(senderAction) === -1) {
      throw new Error('Invalid sender_action provided.');
    }

    const finalUrl = this.constructor.buildURL('me/messages', {
      access_token: this.pageAccessToken,
    });

    return fetch(finalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: { id },
        sender_action: senderAction,
      }),
    })
      .then(response => response.json());
  }

  updateWhitelistedDomains(action_type, domains) {
    const finalUrl = this.constructor.buildURL('me/thread_settings', {
      access_token: this.pageAccessToken,
    });
    return fetch(finalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        setting_type: 'domain_whitelisting',
        domain_action_type: action_type,
        whitelisted_domains: domains,
      }),
    })
      .then(response => response.json());
  }

}

export default MessengerClient;
