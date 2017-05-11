import { QuickReply, QuickReplies } from '../src/QuickReplies';
import { QUICK_REPLY_LIMIT } from '../src/constants';
import Text from '../src/elements/Text';

describe('QuickReplies', () => {
  describe('when created', () => {
    describe('with correct attributes', () => {
      it('returns a valid object', () => {
        const qr = new QuickReply({ title: 'Example', payload: 'payload' });
        const qrs = new QuickReplies([qr]);

        expect(qrs).toEqual({
          quick_replies: [
            {
              title: 'Example',
              content_type: 'text',
              payload: 'payload',
            },
          ],
        });
      });
    });

    describe('Merges with messages', () => {
      it('returns valid object', () => {
        const qr = new QuickReply({ title: 'Location', content_type: 'location' });
        const qrs = new QuickReplies([qr]);
        const text = new Text('Simple text message');
        const payload = Object.assign(text, qrs);

        expect(payload).toEqual({
          text: 'Simple text message',
          quick_replies: [
            {
              title: 'Location',
              content_type: 'location',
            },
          ],
        });
      });
    });
  });

  describe('errors', () => {
    describe('instantiation with non array', () => {
      it('throws error', () => {
        expect(() => {
          new QuickReplies('payload');
        }).toThrow('You must pass an array of QuickReply objects.');
      });
    });

    describe('too many items', () => {
      it('throws error', () => {
        expect(() => {
          new QuickReplies(new Array(QUICK_REPLY_LIMIT + 1));
        }).toThrow(`You cannot have more than ${QUICK_REPLY_LIMIT} quick replies.`);
      });
    });
  });
});

describe('QuickReply', () => {
  describe('new', () => {
    describe('with correct attributes', () => {
      it('returns proper object', () => {
        const qr = new QuickReply({ title: 'Example', payload: 'payload' });

        expect(qr).toEqual({
          content_type: 'text',
          title: 'Example',
          payload: 'payload',
        });
      });
    });

    describe('supports text and image', () => {
      it('returns proper object', () => {
        const qr = new QuickReply({ title: 'Example', payload: 'payload', image_url: 'http://test.com/image.jpg' });

        expect(qr).toEqual({
          content_type: 'text',
          title: 'Example',
          payload: 'payload',
          image_url: 'http://test.com/image.jpg',
        });
      });
    });

    describe('supports location type', () => {
      it('returns valid object', () => {
        const qr = new QuickReply({ title: 'Location', content_type: 'location' });

        expect(qr).toEqual({
          title: 'Location',
          content_type: 'location',
        });
      });
    });
  });

  describe('errors', () => {
    describe('title length', () => {
      it('throws an error', () => {
        expect(() => {
          new QuickReply({ title: 'x'.repeat(21), payload: 'payload' });
        }).toThrow('Title cannot be longer 20 characters.');
      });
    });

    describe('payload length', () => {
      it('throws an error', () => {
        expect(() => {
          new QuickReply({ title: 'Text', payload: 'x'.repeat(1001) });
        }).toThrow('Payload cannot be longer 1000 characters.');
      });
    });

    describe('invalid content type', () => {
      it('throws an error', () => {
        expect(() => {
          new QuickReply({ title: 'Text', content_type: 'wrong' });
        }).toThrow('Invalid content type provided.');
      });
    });
  });
});
