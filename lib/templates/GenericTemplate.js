import BaseTemplate from './BaseTemplate';

class GenericTemplate extends BaseTemplate {
  constructor(elements) {
    super(elements);

    return {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: this.elements
        }
      }
    };

  }
}

export default GenericTemplate;
