import { expect } from 'chai';

import { QuickReply, QuickReplies } from '../lib/QuickReplies';
import Text from '../lib/elements/Text';

describe('QuickReplies', () => {
  describe('when created', () => {
    describe('with correct attributes', () => {
      it('returns a valid object', () => {
        const qr = new QuickReply({ title: 'Example', payload: 'payload' });
        const qrs = new QuickReplies([qr]);

        expect(qrs).to.deep.equal({
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

        expect(payload).to.deep.equal({
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
        }).to.throw('You must pass an array of QuickReply objects.');
      });
    });

    describe('too many items', () => {
      it('throws error', () => {
        expect(() => {
          new QuickReplies(new Array(11));
        }).to.throw('You cannot have more than 10 quick replies.');
      });
    });
  });
});

describe('QuickReply', () => {
  describe('new', () => {
    describe('with correct attributes', () => {
      it('returns proper object', () => {
        const qr = new QuickReply({ title: 'Example', payload: 'payload' });

        expect(qr).to.deep.equal({
          content_type: 'text',
          title: 'Example',
          payload: 'payload',
        });
      });
    });

    describe('supports text and image', () => {
      it('returns proper object', () => {
        const qr = new QuickReply({ title: 'Example', payload: 'payload', image_url: 'http://test.com/image.jpg' });

        expect(qr).to.deep.equal({
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

        expect(qr).to.deep.equal({
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
        }).to.throw('Title cannot be longer 20 characters.');
      });
    });

    describe('payload length', () => {
      it('throws an error', () => {
        expect(() => {
          new QuickReply({ title: 'Text', payload: 'x'.repeat(1001) });
        }).to.throw('Payload cannot be longer 1000 characters.');
      });
    });

    describe('invalid content type', () => {
      it('throws an error', () => {
        expect(() => {
          new QuickReply({ title: 'Text', content_type: 'wrong' });
        }).to.throw('Invalid content type provided.');
      });
    });
  });
});
