import Text from '../../src/elements/Text';

describe('Text', () => {
  describe('new', () => {
    it('returns proper object', () => {
      const text = new Text('Hello user!');
      expect(text).toEqual({ text: 'Hello user!' });
    });
  });
});
