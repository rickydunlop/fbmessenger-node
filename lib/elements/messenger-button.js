import * as _ from 'lodash';

class MessengerButton {
  constructor(attrs) {
    return this.constructObject(attrs);
  }

  constructObject(attrs) {
    const type = this.determineType(attrs);

    if (type === 'web_url') {
      return {
        type: 'web_url',
        url: attrs.url,
        title: attrs.title
      };
    }

    if (type === 'postback') {
      return {
        type: 'postback',
        title: attrs.title,
        payload: attrs.payload
      };
    }
  }

  determineType(attrs) {
    if (_.has(attrs, 'url') && _.has(attrs, 'title')) {
      return 'web_url';
    } else if (_.has(attrs, 'title') && _.has(attrs, 'payload')) {
      return 'postback';
    }
  };
}

export default MessengerButton;
