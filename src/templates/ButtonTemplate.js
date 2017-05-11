import { TEXT_LIMIT } from '../constants';

class ButtonTemplate {
  constructor({ text, buttons }) {
    if (text.length > TEXT_LIMIT) {
      throw new Error(`Text cannot be longer ${TEXT_LIMIT} characters.`);
    }

    if (!Array.isArray(buttons)) {
      throw new Error('buttons must be an array.');
    }

    this.text = text;
    this.buttons = buttons;

    return {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: this.text,
          buttons: this.buttons,
        },
      },
    };
  }
}

export default ButtonTemplate;
