import { TOP_ELEMENT_STYLES } from '../constants';

class ListTemplate {
  constructor({ elements, top_element_style = 'large' }) {
    if (!Array.isArray(elements)) {
      throw new Error('elements must be an array.');
    }

    if (elements.length < 2) {
      throw new Error('You must have more than 2 elements in the template.');
    }

    if (elements.length > 4) {
      throw new Error('You cannot have more than 4 elements in the template.');
    }

    if (TOP_ELEMENT_STYLES.indexOf(top_element_style) === -1) {
      throw new Error('Invalid top_element_style provided.');
    }

    this.elements = elements;
    this.top_element_style = top_element_style;

    return {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'list',
          top_element_style: this.top_element_style,
          elements: this.elements,
        },
      },
    };
  }
}

export default ListTemplate;
