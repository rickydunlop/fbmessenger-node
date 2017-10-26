import Text from '../../src/elements/Text';
import { TEXT_LIMIT } from '../../src/constants';

describe('Text', () => {
  describe('new', () => {
    it('returns valid object', () => {
      const text = new Text('Hello user!');
      expect(text).toEqual({ text: 'Hello user!' });
    });
  });

  describe('length check', () => {
    it('throws an error when too long', () => {
      expect(() => {
        new Text('x'.repeat(TEXT_LIMIT + 1));
      }).toThrow(`Text cannot be longer ${TEXT_LIMIT} characters.`);
    });
  });
});
