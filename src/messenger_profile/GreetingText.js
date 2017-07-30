import { GREETING_TEXT_LIMIT } from '../constants';

class GreetingText {
  constructor({ text, locale = 'default' }) {
    if (text.length > GREETING_TEXT_LIMIT) {
      throw new Error(`Greeting Text limit is ${GREETING_TEXT_LIMIT}.`);
    }

    return {
      text,
      locale,
    };
  }
}

export default GreetingText;
