import { TEXT_LIMIT } from '../constants';

class Text {
  constructor(text) {
    if (text.length > TEXT_LIMIT) {
      throw new Error(`Text cannot be longer ${TEXT_LIMIT} characters.`);
    }

    this.text = text;

    return {
      text: this.text,
    };
  }
}

export default Text;
