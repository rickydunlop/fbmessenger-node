import { expect } from 'chai';

import { QuickReply, QuickReplies } from '../lib/QuickReplies';

describe('QuickReplies', () => {
  describe('new', () => {
    describe('with correct attributes', () => {
      it('returns proper object', () => {
        const qr = new QuickReply('Example', 'payload');
        const qrs = new QuickReplies([qr]);

        expect(qrs).to.deep.equal({
          quick_replies: [
            {
              content_type: 'text',
              title: 'Example',
              payload: 'payload',
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
        const qr = new QuickReply('Example', 'payload');

        expect(qr).to.deep.equal({
          content_type: 'text',
          title: 'Example',
          payload: 'payload',
        });
      });
    });
  });

  describe('errors', () => {
    describe('title length', () => {
      it('throws error', () => {
        expect(() => {
          new QuickReply('x'.repeat(21), 'payload');
        }).to.throw('Title cannot be longer 20 characters.');
      });
    });

    describe('payload length', () => {
      it('throws error', () => {
        expect(() => {
          new QuickReply('Text', 'x'.repeat(1001));
        }).to.throw('Payload cannot be longer 1000 characters.');
      });
    });
  });
});
