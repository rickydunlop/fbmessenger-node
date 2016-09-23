import { expect } from 'chai';

import Video from '../../lib/attachments/Video';

describe('Video', () => {
  describe('new', () => {
    it('returns an object', () => {
      const video = new Video({ url: 'http://test.com/video.mp4' });

      expect(video).to.deep.equal({
        attachment: {
          type: 'video',
          payload: {
            url: 'http://test.com/video.mp4',
          },
        },
      });
    });

    it('is reusable', () => {
      const video = new Video({ url: 'http://test.com/video.mp4', is_reusable: true });

      expect(video).to.deep.equal({
        attachment: {
          type: 'video',
          payload: {
            url: 'http://test.com/video.mp4',
            is_reusable: true,
          },
        },
      });
    });

    it('can be reused', () => {
      const video = new Video({ attachment_id: 1234 });

      expect(video).to.deep.equal({
        attachment: {
          type: 'video',
          payload: {
            attachment_id: 1234,
          },
        },
      });
    });
  });
});
