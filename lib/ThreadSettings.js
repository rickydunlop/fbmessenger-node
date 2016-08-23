class GreetingText {
  constructor(text) {
    this.text = text;

    return {
      setting_type: 'greeting',
      greeting: {
        text: this.text,
      },
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
          payload: this.payload,
        },
      ],
    };
  }
}

class PersistentMenuItem {
  constructor({ type, title, url = '', payload = '' }) {
    const types = [
      'web_url',
      'postback',
    ];

    if (types.indexOf(type) === -1) {
      throw new Error('Invalid type provided.');
    }

    if (title.length > 30) {
      throw new Error('Title cannot be longer 30 characters.');
    }

    if (payload && payload.length > 1000) {
      throw new Error('Payload cannot be longer 1000 characters.');
    }

    if (type === 'web_url' && !url) {
      throw new Error('`url` must be supplied for `web_url` type menu items.');
    }

    if (type === 'postback' && !payload) {
      throw new Error('`payload` must be supplied for `postback` type menu items.');
    }

    this.type = type;
    this.title = title;
    this.url = url;
    this.payload = payload;

    const res = {
      type: this.type,
      title: this.title,
    };

    if (this.url && this.type === 'web_url') {
      res.url = this.url;
    }

    if (this.payload && this.type === 'postback') {
      res.payload = this.payload;
    }

    return res;
  }
}

class PersistentMenu {
  constructor(menuItems) {
    if (!Array.isArray(menuItems)) {
      throw new Error('You must pass an array of PersistentMenuItem objects.');
    }

    if (menuItems.length > 5) {
      throw new Error('You cannot have more than 5 menu items.');
    }

    this.menuItems = menuItems;

    return {
      setting_type: 'call_to_actions',
      thread_state: 'existing_thread',
      call_to_actions: this.menuItems,
    };
  }
}

export {
  GreetingText,
  GetStartedButton,
  PersistentMenuItem,
  PersistentMenu,
};
