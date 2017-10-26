import { PERSISTENT_MENU_TOP_LEVEL_CTA_LIMIT } from '../constants';

class PersistentMenu {
  constructor({ locale = 'default', call_to_actions, composer_input_disabled }) {
    if (!Array.isArray(call_to_actions)) {
      throw new Error('You must pass an array of menu item objects.');
    }

    if (call_to_actions.length > PERSISTENT_MENU_TOP_LEVEL_CTA_LIMIT) {
      throw new Error(`You cannot have more than ${PERSISTENT_MENU_TOP_LEVEL_CTA_LIMIT} menu items.`);
    }

    const res = {
      locale,
      call_to_actions,
    };

    if (composer_input_disabled) {
      res.composer_input_disabled = composer_input_disabled;
    }

    return res;
  }
}

export default PersistentMenu;
