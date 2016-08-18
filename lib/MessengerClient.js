import url from 'url';

import fetch from 'node-fetch';

class MessengerClient {
  constructor(pageAccessToken) {
    this.pageAccessToken = pageAccessToken;
  }

  buildURL(pathname, query) {
    let urlObject = {
      'protocol': 'https',
      'host': 'graph.facebook.com',
      'pathname': `/v2.6/${pathname}`,
      'query': query
    };
    return url.format(urlObject);
  }

  getUser(id) {
    let url = this.buildURL(id, {
      fields: 'first_name,last_name,profile_pic,locale,timezone,gender',
      access_token: this.pageAccessToken
    });

    return fetch(url)
      .then((response) => response.json());
  }

  send(payload, id) {
    let url = this.buildURL('me/messages', {
      access_token: this.pageAccessToken
    });
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipient: { id: id },
        message: payload
      })
    })
      .then((response) => response.json());
  }

  subscribe_app_to_page() {
    let url = this.buildURL('me/subscribed_apps', {
      access_token: this.pageAccessToken
    });
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json());
  }

  set_thread_setting(payload) {
    let url = this.buildURL('me/thread_settings', {
      access_token: this.pageAccessToken
    });
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then((response) => response.json());
  }

  delete_get_started() {
    let url = this.buildURL('me/thread_settings', {
      access_token: this.pageAccessToken
    });
    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'setting_type': 'call_to_actions',
        'thread_state': 'new_thread'
      })
    })
      .then((response) => response.json());
  }

  link_account(account_linking_token) {
    let url = this.buildURL('me', {
      access_token: this.pageAccessToken,
      fields: 'recipient',
      account_linking_token: account_linking_token
    });
    return fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json());
  }

  unlink_account(psid) {
    let url = this.buildURL('me/unlink_accounts', {
      access_token: this.pageAccessToken
    });
    return fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        psid: psid
      })
    })
      .then((response) => response.json());
  }

  sender_action(sender_action, id) {
    let actions = [
      'mark_seen',
      'typing_on',
      'typing_off'
    ];

    if (actions.indexOf(sender_action) === -1) {
      throw 'Invalid sender_action provided.';
    }

    let url = this.buildURL('me/messages', {
      access_token: this.pageAccessToken
    });
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipient: { id: id },
        sender_action: sender_action
      })
    })
      .then((response) => response.json());
  }

}

export default MessengerClient;
