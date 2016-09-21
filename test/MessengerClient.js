import { expect } from 'chai';
import nock from 'nock';

import MessengerClient from '../lib/MessengerClient';

const client = new MessengerClient({
  pageAccessToken: 'PAGE_ACCESS_TOKEN',
});


describe('MessengerClient', () => {
  describe('get user', () => {
    it('calls get user', (done) => {
      nock('https://graph.facebook.com')
        .get(/USER_ID/)
        .reply(200, {
          username: 'test',
          id: 1,
        });
      client.getUser('USER_ID').then((user) => {
        try {
          expect(user).to.include.keys('username');
          expect(user).to.include.keys('id');
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  describe('send', () => {
    it('calls send', (done) => {
      nock('https://graph.facebook.com')
        .post(/me/)
        .reply(200, {
          recipient_id: '1008372609250235',
          message_id: 'mid.1456970487936:c34767dfe57ee6e339',
        });

      const payload = {
        recipient: {
          id: 'USER_ID',
        },
        message: {
          text: 'hello, world!',
        },
      };
      client.send(payload, 'USER_ID').then((resp) => {
        try {
          expect(resp).to.include.keys('recipient_id');
          expect(resp).to.include.keys('message_id');
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  describe('Thread settings', () => {
    it('calls set_thread_setting', (done) => {
      nock('https://graph.facebook.com')
        .post(/me\/thread_settings/)
        .reply(200, {
          result: true,
        });

      const payload = {
        setting_type: 'greeting',
        greeting: {
          text: 'Welcome to My Company!',
        },
      };
      client.setThreadSetting(payload).then((resp) => {
        try {
          expect(resp).to.include.keys('result');
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('can subscribe an app to a page', (done) => {
      nock('https://graph.facebook.com')
        .post(/me\/subscribed_apps/)
        .reply(200, {
          result: true,
        });
      client.subscribeAppToPage().then((resp) => {
        try {
          expect(resp).to.include.keys('result');
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('can delete the get started button', (done) => {
      nock('https://graph.facebook.com')
        .delete(/me\/thread_settings/)
        .reply(200, {
          result: true,
        });

      client.deleteGetStarted().then((resp) => {
        try {
          expect(resp).to.include.keys('result');
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('can add a whitelisted domain', (done) => {
      nock('https://graph.facebook.com')
        .post(/me\/thread_settings/)
        .reply(200, {
          result: true,
        });

      const domains = ['http://facebook.com'];
      client.updateWhitelistedDomains('add', domains).then((resp) => {
        try {
          expect(resp).to.include.keys('result');
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('can remove a whitelisted domain', (done) => {
      nock('https://graph.facebook.com')
        .post(/me\/thread_settings/)
        .reply(200, {
          result: true,
        });

      const domains = ['http://facebook.com'];
      client.updateWhitelistedDomains('remove', domains).then((resp) => {
        try {
          expect(resp).to.include.keys('result');
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  describe('Account linking', () => {
    it('can link an account', (done) => {
      nock('https://graph.facebook.com')
        .get(/me/)
        .reply(200, {
          id: 'PAGE_ID',
          recipient: 'PSID',
        });

      client.linkAccount('ACCOUNT_LINKING_TOKEN').then((resp) => {
        try {
          expect(resp).to.include.keys('id');
          expect(resp).to.include.keys('recipient');
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('can unlink an account', (done) => {
      nock('https://graph.facebook.com')
        .post(/me\/unlink_accounts/)
        .reply(200, {
          result: 'unlink account success',
        });

      client.unlinkAccount('psid').then((resp) => {
        try {
          expect(resp).to.include.keys('result');
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  describe('Sender actions', () => {
    it('calls sender action', (done) => {
      nock('https://graph.facebook.com')
        .post(/me/)
        .reply(200, {
          recipient_id: '1008372609250235',
          message_id: 'mid.1456970487936:c34767dfe57ee6e339',
        });

      client.senderAction('typing_on', '1008372609250235').then((resp) => {
        try {
          expect(resp).to.include.keys('recipient_id');
          expect(resp).to.include.keys('message_id');
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('calls throws an error with invalid action', () => {
      nock('https://graph.facebook.com')
        .post(/me/)
        .reply(200, {
          recipient_id: '1008372609250235',
          message_id: 'mid.1456970487936:c34767dfe57ee6e339',
        });

      expect(() => {
        client.senderAction('wrong');
      }).to.throw('Invalid sender_action provided.');
    });
  });
});
