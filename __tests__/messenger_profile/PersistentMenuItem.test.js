import {
  PersistentMenuItem,
} from '../../src/messenger_profile';
import {
  PERSISTENT_MENU_SUB_LEVEL_CTA_LIMIT,
} from '../../src/constants';

describe('persistent menu item', () => {
  it('works for postbacks', () => {
    const item = new PersistentMenuItem({
      type: 'postback',
      title: 'Help',
      payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_HELP',
    });
    expect(item).toEqual({
      type: 'postback',
      title: 'Help',
      payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_HELP',
    });
  });

  it('works for web urls', () => {
    const item = new PersistentMenuItem({
      type: 'web_url',
      title: 'Help',
      url: 'http://facebook.com',
    });
    expect(item).toEqual({
      type: 'web_url',
      title: 'Help',
      url: 'http://facebook.com',
    });
  });

  it('allows extra parameters to be set', () => {
    const item = new PersistentMenuItem({
      type: 'web_url',
      title: 'Help',
      url: 'http://facebook.com',
      webview_height_ratio: 'full',
      messenger_extensions: true,
      fallback_url: 'http:facebook.com',
      webview_share_button: 'hide',
    });
    expect(item).toEqual({
      type: 'web_url',
      title: 'Help',
      url: 'http://facebook.com',
      webview_height_ratio: 'full',
      messenger_extensions: true,
      fallback_url: 'http:facebook.com',
      webview_share_button: 'hide',
    });
  });

  it('supports nested menu items', () => {
    const nestedItem = new PersistentMenuItem({
      type: 'web_url',
      title: 'Help',
      url: 'http://facebook.com',
    });
    const item = new PersistentMenuItem({
      type: 'nested',
      title: 'Help',
      call_to_actions: [nestedItem],
    });
    expect(item).toEqual({
      type: 'nested',
      title: 'Help',
      call_to_actions: [{
        type: 'web_url',
        title: 'Help',
        url: 'http://facebook.com',
      }],
    });
  });

  it('ensures messenger extensions is a boolean', () => {
    const item = new PersistentMenuItem({
      type: 'web_url',
      title: 'Help',
      url: 'http://facebook.com',
      messenger_extensions: 'true',
    });
    expect(item).toEqual({
      type: 'web_url',
      title: 'Help',
      url: 'http://facebook.com',
      messenger_extensions: true,
    });
  });

  it('checks sub level menu items dont exceed max amount', () => {
    expect(() => {
      new PersistentMenuItem({
        type: 'nested',
        title: 'Help',
        payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_HELP',
        call_to_actions: Array(PERSISTENT_MENU_SUB_LEVEL_CTA_LIMIT + 1).fill('x'),
      });
    }).toThrow(`call_to_actions is limited to ${PERSISTENT_MENU_SUB_LEVEL_CTA_LIMIT} for sub-levels`);
  });

  it('it errors when type is nested and no ctas are supplied', () => {
    expect(() => {
      new PersistentMenuItem({
        type: 'nested',
        title: 'Help',
      });
    }).toThrow('`call_to_actions` must be supplied for `nested` type menu items.');
  });

  it('it errors on invalid type', () => {
    expect(() => {
      new PersistentMenuItem({
        type: 'wrong',
        title: 'Help',
        payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_HELP',
      });
    }).toThrow('Invalid type provided.');
  });

  it('it errors on title too long', () => {
    expect(() => {
      new PersistentMenuItem({
        type: 'postback',
        title: 'x'.repeat(31),
        payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_HELP',
      });
    }).toThrow('Title cannot be longer 30 characters.');
  });

  it('it errors on payload too long', () => {
    expect(() => {
      new PersistentMenuItem({
        type: 'postback',
        title: 'title',
        payload: 'x'.repeat(1001),
      });
    }).toThrow('Payload cannot be longer 1000 characters.');
  });

  it('it errors if web_url and no url provided', () => {
    expect(() => {
      new PersistentMenuItem({
        type: 'web_url',
        title: 'title',
      });
    }).toThrow('`url` must be supplied for `web_url` type menu items.');
  });

  it('it errors if postback and no payload provided', () => {
    expect(() => {
      new PersistentMenuItem({
        type: 'postback',
        title: 'title',
      });
    }).toThrow('`payload` must be supplied for `postback` type menu items.');
  });

  it('it errors if incorrect webview_height_ratio is provided', () => {
    expect(() => {
      new PersistentMenuItem({
        type: 'web_url',
        title: 'title',
        url: 'https://facebook.com',
        webview_height_ratio: 'wrong',
      });
    }).toThrow('Invalid `webview_height_ratio` provided.');
  });
});
