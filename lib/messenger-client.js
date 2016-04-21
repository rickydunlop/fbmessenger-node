import request from 'request';
import Promise from 'bluebird';

Promise.promisifyAll(request);

class MessengerClient {
  constructor(context) {
    this.context = context;
  }

  getUserData(id) {
    return request.getAsync({
      uri: `https://graph.facebook.com/v2.6/${id}`,
      qs: {
        fields: 'first_name,last_name,profile_pic',
        access_token: this.context.pageAccessToken
      },
      json: true
    }).then((response) => {
      return response.body;
    });
  }
}

export default MessengerClient;
