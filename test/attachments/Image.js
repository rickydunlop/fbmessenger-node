import { expect } from 'chai';

import Image from '../../lib/attachments/Image';

describe('Image', () => {
  describe('new', () => {
    it('returns an object', () => {
      const image = new Image({ url: 'http://test.com/image.jpg' });

      expect(image).to.deep.equal({
        attachment: {
          type: 'image',
          payload: {
            url: 'http://test.com/image.jpg',
          },
        },
      });
    });

    it('is reusable', () => {
      const image = new Image({ url: 'http://test.com/image.jpg', is_reusable: true });

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

    it('can be reused', () => {
      const image = new Image({ attachment_id: 1234 });

      expect(image).to.deep.equal({
        attachment: {
          type: 'image',
          payload: {
            attachment_id: 1234,
          },
        },
      });
    });
  });
});
