import request from 'request';
import Promise from 'bluebird';

Promise.promisifyAll(request);

class MessengerClient {
  constructor(context) {
    this.context = context;
  }

  getUserData(entry) {
    return request.getAsync({
      uri: `https://graph.facebook.com/v2.6/${entry.sender.id}`,
      qs: {
        fields: 'first_name,last_name,profile_pic',
        access_token: this.context.pageAccessToken
      },
      json: true
    }).then((response) => {
      return response.body;
    });
  }

  sendData(payload, entry) {
    return request.postAsync({
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {
        access_token: this.context.pageAccessToken
      },
      json: {
        recipient: { id: entry.sender.id },
        message: payload
      }
    });
  }

  subscribeAppToPage() {
    return request.postAsync({
      uri: `https://graph.facebook.com/v2.6/me/subscribed_apps`,
      qs: {
        access_token: this.context.pageAccessToken
      },
      json: true
    });
  }
}

export default MessengerClient;
