import {
  WEBVIEW_HEIGHT_RATIOS,
  PERSISTENT_MENU_TYPES,
  PERSISTENT_MENU_TITLE_MAX_LENGTH,
  PERSISTENT_MENU_PAYLOAD_MAX_LENGTH,
  PERSISTENT_MENU_SUB_LEVEL_CTA_LIMIT,
} from '../constants';

class PersistentMenuItem {
  constructor({
    type,
    title,
    url = '',
    payload = '',
    call_to_actions = [],
    webview_height_ratio = '',
    messenger_extensions = false,
    fallback_url = '',
    webview_share_button = '',
  }) {
    if (PERSISTENT_MENU_TYPES.indexOf(type) === -1) {
      throw new Error('Invalid type provided.');
    }

    if (title.length > PERSISTENT_MENU_TITLE_MAX_LENGTH) {
      throw new Error(`Title cannot be longer ${PERSISTENT_MENU_TITLE_MAX_LENGTH} characters.`);
    }

    if (payload && payload.length > PERSISTENT_MENU_PAYLOAD_MAX_LENGTH) {
      throw new Error(`Payload cannot be longer ${PERSISTENT_MENU_PAYLOAD_MAX_LENGTH} characters.`);
    }

    if (type === 'web_url' && !url) {
      throw new Error('`url` must be supplied for `web_url` type menu items.');
    }

    if (type === 'postback' && !payload) {
      throw new Error('`payload` must be supplied for `postback` type menu items.');
    }

    if (type === 'nested' && !call_to_actions.length) {
      throw new Error('`call_to_actions` must be supplied for `nested` type menu items.');
    }

    if (webview_height_ratio && WEBVIEW_HEIGHT_RATIOS.indexOf(webview_height_ratio) === -1) {
      throw new Error('Invalid `webview_height_ratio` provided.');
    }

    const res = {
      type,
      title,
    };

    if (url && type === 'web_url') {
      res.url = url;
    }

    if (payload && type === 'postback') {
      res.payload = payload;
    }

    if (call_to_actions && type === 'nested') {
      if (call_to_actions.length > PERSISTENT_MENU_SUB_LEVEL_CTA_LIMIT) {
        throw new Error(`call_to_actions is limited to ${PERSISTENT_MENU_SUB_LEVEL_CTA_LIMIT} for sub-levels`);
      }
      res.call_to_actions = call_to_actions;
    }

    if (webview_height_ratio) {
      res.webview_height_ratio = webview_height_ratio;
    }

    if (messenger_extensions) {
      res.messenger_extensions = Boolean(messenger_extensions);
      if (fallback_url) {
        res.fallback_url = fallback_url;
      }
    }

    if (webview_share_button) {
      res.webview_share_button = webview_share_button;
    }

    return res;
  }
}

export default PersistentMenuItem;
