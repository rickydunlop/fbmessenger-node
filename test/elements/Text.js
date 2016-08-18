import { expect } from 'chai';

import Text from '../../lib/elements/Text';

describe('Text', () => {
  describe('new', () => {
    it('returns proper object', () => {
      let text = new Text('Hello user!');
      expect(text).to.deep.equal({ text: 'Hello user!' });
    });
  });
});
