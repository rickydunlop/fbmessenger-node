import { expect } from 'chai';

import File from '../../lib/attachments/File';

describe('File', () => {
  describe('new', () => {
    it('returns an object', () => {
      const file = new File('http://test.com/file.mp3');

      expect(file).to.deep.equal({
        attachment: {
          type: 'file',
          payload: {
            url: 'http://test.com/file.mp3'
          }
        }
      });
    });
  });
});
