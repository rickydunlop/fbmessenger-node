class BaseTemplate {

  constructor(elements) {

    if (!Array.isArray(elements)) {
      throw 'elements must be an array.';
    }

    if (elements.length > 10) {
      throw 'You cannot have more than 10 elements in the template.';
    }

    this.elements = elements;
  }
}

export default BaseTemplate;
