import { expect } from 'chai';

import MessengerText from '../../lib/elements/messenger-text';

describe('MessengerText', () => {
  describe('new', () => {
    it('returns proper object', () => {
      const text = new MessengerText('Hello user!');

      expect(text).to.deep.equal({ text: 'Hello user!' });
    });
  });
});
