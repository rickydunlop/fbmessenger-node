import Audio from '../../src/attachments/Audio';

describe('Audio', () => {
  describe('new', () => {
    it('returns an object', () => {
      const audio = new Audio({ url: 'http://test.com/audio.mp3' });

      expect(audio).toEqual({
        attachment: {
          type: 'audio',
          payload: {
            url: 'http://test.com/audio.mp3',
          },
        },
      });
    });

    it('is reusable', () => {
      const audio = new Audio({ url: 'http://test.com/audio.mp3', is_reusable: true });

      expect(audio).toEqual({
        attachment: {
          type: 'audio',
          payload: {
            url: 'http://test.com/audio.mp3',
            is_reusable: true,
          },
        },
      });
    });

    it('can be reused', () => {
      const audio = new Audio({ attachment_id: 1234 });

      expect(audio).toEqual({
        attachment: {
          type: 'audio',
          payload: {
            attachment_id: 1234,
          },
        },
      });
    });
  });
});
