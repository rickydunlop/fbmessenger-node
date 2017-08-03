import BaseTemplate from './BaseTemplate';

class OpenGraphTemplate extends BaseTemplate {
  constructor({ elements }) {
    super(elements);

    return {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'open_graph',
          elements,
        },
      },
    };
  }
}

export default OpenGraphTemplate;
