import { expect } from 'chai';

import MessengerImage from '../../lib/elements/messenger-image';

describe('MessengerImage', () => {
  describe('new', () => {
    it('returns proper object', () => {
      const image = new MessengerImage('http://coolimage.com');

      expect(image).to.deep.equal({
        attachment: {
          type: 'image',
          payload: {
            url: 'http://coolimage.com'
          }
        }
      });
    });
  });
});
