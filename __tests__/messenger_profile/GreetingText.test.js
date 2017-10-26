import { GreetingText } from '../../src/messenger_profile';
import { GREETING_TEXT_LIMIT } from '../../src/constants';

describe('Greeting text', () => {
  it('returns a valid object', () => {
    const text = new GreetingText({ text: 'Welcome to My Company!' });
    expect(text).toEqual({
      text: 'Welcome to My Company!',
      locale: 'default',
    });
  });

  it('should throw an error if the text is too long', () => {
    expect(() => {
      const text = 'x'.repeat(GREETING_TEXT_LIMIT + 1);
      new GreetingText({ text });
    }).toThrow(`Greeting Text limit is ${GREETING_TEXT_LIMIT}.`);
  });
});
