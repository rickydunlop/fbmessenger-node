class GreetingText {
  constructor(text) {
    this.text = text;

    return {
      setting_type: 'greeting',
      greeting: {
        text: this.text
      }
    };
  }
}

class GetStartedButton {
  constructor(payload) {
    this.payload = payload;

    return {
      setting_type: 'call_to_actions',
      thread_state: 'new_thread',
      call_to_actions: [
        {
          payload: this.payload
        }
      ]
    };
  }
}

class PersistentMenuItem {
  constructor({ type, title, url='', payload='' }) {
    let types = [
      'web_url',
      'postback'
    ];

    if (types.indexOf(type) === -1) {
      throw 'Invalid type provided.';
    }

    if (title.length > 30) {
      throw 'Title cannot be longer 30 characters.';
    }

    if (payload && payload.length > 1000) {
      throw'Payload cannot be longer 1000 characters.';
    }

    if (type == 'web_url' && url == '') {
      throw '`url` must be supplied for `web_url` type menu items.';
    }

    if (type == 'postback' && payload == '') {
      throw '`payload` must be supplied for `postback` type menu items.';
    }

    this.type = type;
    this.title = title;
    this.url = url;
    this.payload = payload;

    let res = {
      type: this.type,
      title: this.title
    };

    if (this.url && this.type == 'web_url') {
      res['url'] = this.url;
    }

    if (this.payload && this.type == 'postback') {
      res['payload'] = this.payload;
    }

    return res;
  }
}

class PersistentMenu {
  constructor(menu_items = []) {

    if (!Array.isArray(menu_items)) {
      throw 'You must pass an array of PersistentMenuItem objects.';
    }

    if (menu_items.length > 5) {
      throw 'You cannot have more than 5 menu items.';
    }

    this.menu_items = menu_items;

    return {
      setting_type: 'call_to_actions',
      thread_state: 'existing_thread',
      call_to_actions: this.menu_items
    };
  }
}

export {
  GreetingText,
  GetStartedButton,
  PersistentMenuItem,
  PersistentMenu
};
