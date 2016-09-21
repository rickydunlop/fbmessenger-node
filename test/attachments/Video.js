import { expect } from 'chai';

import Video from '../../lib/attachments/Video';

describe('Video', () => {
  describe('new', () => {
    it('returns an object', () => {
      const video = new Video('http://test.com/video.mp4');

      expect(video).to.deep.equal({
        attachment: {
          type: 'video',
          payload: {
            url: 'http://test.com/video.mp4',
            is_reusable: false,
          },
        },
      });
    });
  });
});
