import { expect } from 'chai';

import Audio from '../../lib/attachments/Audio';

describe('Audio', () => {
  describe('new', () => {
    it('returns an object', () => {
      const audio = new Audio('http://test.com/audio.mp3');

      expect(audio).to.deep.equal({
        attachment: {
          type: 'audio',
          payload: {
            url: 'http://test.com/audio.mp3'
          }
        }
      });
    });
  });
});
