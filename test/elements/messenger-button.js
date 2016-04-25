import { expect } from 'chai';

import MessengerButton from '../../lib/elements/messenger-button';

describe('MessengerButton', () => {
  describe('new', () => {
    describe('with type of web_url', () => {
      it('returns proper object', () => {
        const button = new MessengerButton({
          url: 'http://www.example.com',
          title: 'Example Title'
        });

        expect(button).to.deep.equal({
          type: 'web_url',
          url: 'http://www.example.com',
          title: 'Example Title'
        });
      });
    });

    describe('with type of postback', () => {
      it('returns proper object', () => {
        const button = new MessengerButton({
          title: 'Example Title',
          payload: 'EXAMPLE'
        });

        expect(button).to.deep.equal({
          type: 'postback',
          title: 'Example Title',
          payload: 'EXAMPLE'
        });
      });
    });
  });
});
