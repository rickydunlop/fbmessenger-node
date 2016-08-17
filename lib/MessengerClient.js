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
      body: JSON.stringify({
        recipient: { id: id },
        message: payload
      })
    })
      .then((response) => response.json());
  }
}

export default MessengerClient;
