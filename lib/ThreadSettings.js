import {
  WEBVIEW_HEIGHT_RATIOS,
  PERSISTENT_MENU_TYPES,
} from './constants';

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
  constructor({
    type,
    title,
    url = '',
    payload = '',
    webview_height_ratio = '',
    messenger_extensions = false,
  }) {
    if (PERSISTENT_MENU_TYPES.indexOf(type) === -1) {
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

    if (webview_height_ratio && WEBVIEW_HEIGHT_RATIOS.indexOf(webview_height_ratio) === -1) {
      throw new Error('Invalid `webview_height_ratio` provided.');
    }

    this.type = type;
    this.title = title;
    this.url = url;
    this.payload = payload;
    this.webview_height_ratio = webview_height_ratio;
    this.messenger_extensions = Boolean(messenger_extensions);

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

    if (this.webview_height_ratio) {
      res.webview_height_ratio = this.webview_height_ratio;
    }

    if (this.messenger_extensions) {
      res.messenger_extensions = this.messenger_extensions;
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
