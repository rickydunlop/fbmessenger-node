class BaseTemplate {
  constructor(elements) {
    if (!Array.isArray(elements)) {
      throw new Error('elements must be an array.');
    }

    if (elements.length > 10) {
      throw new Error('You cannot have more than 10 elements in the template.');
    }

    this.elements = elements;
  }
}

export default BaseTemplate;
