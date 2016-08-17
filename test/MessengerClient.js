import { expect } from 'chai';
import nock from 'nock';

import MessengerClient from '../lib/MessengerClient';

describe('MessengerClient', () => {
  describe('get user', () => {
    it('calls get user', (done) => {
      let client = new MessengerClient({
        pageAccessToken: 'PAGE_ACCESS_TOKEN'
      });
      let scope = nock('https://graph.facebook.com')
        .get(/USER_ID/)
        .reply(200, {'username': 'test', id: 1});
      client.getUser('USER_ID').then(user => {
        try {
          expect(user).to.include.keys('username');
          expect(user).to.include.keys('id');
          done();
        } catch(e) {
          done(e);
        }
      });
    });
  });

  describe('send', () => {
    it('calls send', (done) => {
      let client = new MessengerClient({
        pageAccessToken: 'PAGE_ACCESS_TOKEN'
      });
      let scope = nock('https://graph.facebook.com')
        .post(/me/)
        .reply(200, {
          'recipient_id': '1008372609250235',
          'message_id': 'mid.1456970487936:c34767dfe57ee6e339'
        });

      let payload = {
        'recipient':{
          'id':'USER_ID'
        },
        'message':{
          'text':'hello, world!'
        }
      };
      client.send(payload, 'USER_ID').then(resp => {
        try {
          expect(resp).to.include.keys('recipient_id');
          expect(resp).to.include.keys('message_id');
          done();
        } catch(e) {
          done(e);
        }
      });
    });
  });
});
