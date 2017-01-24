import Video from '../../src/attachments/Video';

describe('Video', () => {
  describe('new', () => {
    it('returns an object', () => {
      const video = new Video({ url: 'http://test.com/video.mp4' });

      expect(video).toEqual({
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

      expect(video).toEqual({
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

      expect(video).toEqual({
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
