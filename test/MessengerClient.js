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

  describe('Thread settings', () => {
    it('calls set_thread_setting', (done) => {
      let client = new MessengerClient({
        pageAccessToken: 'PAGE_ACCESS_TOKEN'
      });
      let scope = nock('https://graph.facebook.com')
        .post(/me\/thread_settings/)
        .reply(200, {
          'result': true
        });

      let payload = {
        'setting_type':'greeting',
        'greeting':{
          'text':'Welcome to My Company!'
        }
      };
      client.set_thread_setting(payload).then(resp => {
        try {
          expect(resp).to.include.keys('result');
          done();
        } catch(e) {
          done(e);
        }
      });
    });
  });

  describe('sender action', () => {
    it('calls sender action', (done) => {
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
        'sender_action': 'typing_on'
      };
      client.sender_action('typing_on', '1008372609250235').then(resp => {
        try {
          expect(resp).to.include.keys('recipient_id');
          expect(resp).to.include.keys('message_id');
          done();
        } catch(e) {
          done(e);
        }
      });
    });

    it('calls throws an error with invalid action', () => {
      let client = new MessengerClient({
        pageAccessToken: 'PAGE_ACCESS_TOKEN'
      });
      let scope = nock('https://graph.facebook.com')
        .post(/me/)
        .reply(200, {
          'recipient_id': '1008372609250235',
          'message_id': 'mid.1456970487936:c34767dfe57ee6e339'
        });

      expect(() => {
        client.sender_action('wrong');
      }).to.throw('Invalid sender_action provided.');
    });
  });


});
