import {
  PersistentMenu,
  PersistentMenuItem,
} from '../../src/messenger_profile';
import {
  PERSISTENT_MENU_TOP_LEVEL_CTA_LIMIT,
} from '../../src/constants';

describe('persistent menu', () => {
  it('can set the persistent menu', () => {
    const item_1 = new PersistentMenuItem({
      type: 'postback',
      title: 'Help',
      payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_HELP',
    });

    const item_2 = new PersistentMenuItem({
      type: 'web_url',
      title: 'Help',
      url: 'http://facebook.com',
    });

    const menu = new PersistentMenu({
      call_to_actions: [item_1, item_2],
    });
    expect(menu).toEqual({
      locale: 'default',
      call_to_actions: [
        {
          type: 'postback',
          title: 'Help',
          payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_HELP',
        },
        {
          type: 'web_url',
          title: 'Help',
          url: 'http://facebook.com',
        },
      ],
    });
  });

  it('can handle composer_input_disabled', () => {
    const item = new PersistentMenuItem({
      type: 'postback',
      title: 'Help',
      payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_HELP',
    });

    const menu = new PersistentMenu({
      call_to_actions: [item],
      composer_input_disabled: true,
    });
    expect(menu).toEqual({
      locale: 'default',
      composer_input_disabled: true,
      call_to_actions: [
        {
          type: 'postback',
          title: 'Help',
          payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_HELP',
        },
      ],
    });
  });

  it('should throw an error if instantiated with no menu items', () => {
    expect(() => {
      new PersistentMenu('payload');
    }).toThrow('You must pass an array of menu item objects.');
  });

  it('should throw an error if instantiated with too many menu items', () => {
    expect(() => {
      const items = new Array(PERSISTENT_MENU_TOP_LEVEL_CTA_LIMIT + 1);
      new PersistentMenu({ call_to_actions: items });
    }).toThrow(`You cannot have more than ${PERSISTENT_MENU_TOP_LEVEL_CTA_LIMIT} menu items.`);
  });
});
