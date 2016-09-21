import { expect } from 'chai';

import Image from '../../lib/attachments/Image';

describe('Image', () => {
  describe('new', () => {
    it('returns an object', () => {
      const image = new Image('http://test.com/image.jpg');

      expect(image).to.deep.equal({
        attachment: {
          type: 'image',
          payload: {
            url: 'http://test.com/image.jpg',
            is_reusable: false,
          },
        },
      });
    });

    it('is reusable', () => {
      const image = new Image('http://test.com/image.jpg', true);

      expect(image).to.deep.equal({
        attachment: {
          type: 'image',
          payload: {
            url: 'http://test.com/image.jpg',
            is_reusable: true,
          },
        },
      });
    });
  });
});
