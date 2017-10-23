import {
  TOP_ELEMENT_STYLES,
  LIST_TEMPLATE_MIN_ELEMENTS,
  LIST_TEMPLATE_MAX_ELEMENTS,
  LIST_TEMPLATE_MAX_BUTTONS,
} from '../constants';

class ListTemplate {
  constructor({
    elements, buttons = [], top_element_style = 'large', sharable = true,
  }) {
    if (!Array.isArray(elements)) {
      throw new Error('elements must be an array.');
    }

    if (elements.length < LIST_TEMPLATE_MIN_ELEMENTS) {
      throw new Error(`You must have more than ${LIST_TEMPLATE_MIN_ELEMENTS} elements.`);
    }

    if (elements.length > LIST_TEMPLATE_MAX_ELEMENTS) {
      throw new Error(`You cannot have more than ${LIST_TEMPLATE_MAX_ELEMENTS} elements.`);
    }

    if (TOP_ELEMENT_STYLES.indexOf(top_element_style) === -1) {
      throw new Error('Invalid top_element_style provided.');
    }

    if (buttons && buttons.length > 1) {
      throw new Error(`You can have a maximum of ${LIST_TEMPLATE_MAX_BUTTONS} button`);
    }

    return {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'list',
          top_element_style,
          elements,
          sharable,
          buttons,
        },
      },
    };
  }
}

export default ListTemplate;
