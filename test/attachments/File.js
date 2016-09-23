import { expect } from 'chai';

import File from '../../lib/attachments/File';

describe('File', () => {
  describe('new', () => {
    it('returns an object', () => {
      const file = new File({ url: 'http://test.com/file.mp3' });

      expect(file).to.deep.equal({
        attachment: {
          type: 'file',
          payload: {
            url: 'http://test.com/file.mp3',
          },
        },
      });
    });

    it('is reusable', () => {
      const file = new File({ url: 'http://test.com/file.pdf', is_reusable: true });

      expect(file).to.deep.equal({
        attachment: {
          type: 'file',
          payload: {
            url: 'http://test.com/file.pdf',
            is_reusable: true,
          },
        },
      });
    });

    it('can be reused', () => {
      const file = new File({ attachment_id: 1234 });

      expect(file).to.deep.equal({
        attachment: {
          type: 'file',
          payload: {
            attachment_id: 1234,
          },
        },
      });
    });
  });
});
