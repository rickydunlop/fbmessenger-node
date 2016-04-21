import { expect } from 'chai';

import MessengerWrapper from '../messenger-wrapper';

describe('MessengerWrapper', () => {
  describe('new', () => {
    describe('with all attributes', () => {
      it('initializes correctly', () => {
        const wrapper = new MessengerWrapper({
          verifyToken: 'verify_token',
          pageAccessToken: 'page_access_token'
        });

        expect(wrapper).to.be.ok;
      });
    });

    describe('with one attribute missing', () => {
      it('throws an error', () => {
        expect(() => {
          new MessengerWrapper({ verifyToken: 'verify_token' })
        }).to.throw(Error, 'VERIFY_TOKEN or PAGE_ACCESS_TOKEN are missing.');
      });
    });
  });
});
