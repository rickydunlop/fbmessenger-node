import nock from 'nock';

import { Messenger } from '../src/Messenger';
import Image from '../src/attachments/Image';

const messenger = new Messenger({
  pageAccessToken: 'PAGE_ACCESS_TOKEN',
});

function generatePayload(key, payload) {
  const res = {
    object: 'page',
    entry: [
      {
        id: 1234,
        time: 1457764198246,
        messaging: [
          {
            sender: {
              id: 1234,
            },
            recipient: {
              id: 1234,
            },
            timestamp: 1457764197627,
          },
        ],
      },
    ],
  };
  res.entry[0].messaging[0][key] = payload;
  return res;
}

describe('Messenger', () => {
  describe('new', () => {
    describe('with all attributes', () => {
      it('initializes correctly', () => expect(messenger).toBeTruthy());
    });

    describe('with an attribute missing', () => {
      it('throws an error', () => {
        expect(() => {
          new Messenger();
        }).toThrowError('PAGE_ACCESS_TOKEN is missing.');
      });
    });
  });

  describe('Events', () => {
    let eventHandler;
    beforeEach(() => {
      eventHandler = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('Handles message', () => {
      messenger.on('message', eventHandler);
      const payload = generatePayload('message', {
        mid: 'mid.1457764197618:41d102a3e1ae206a38',
        seq: 73,
        text: 'hello, world!',
        quick_reply: {
          payload: 'DEVELOPER_DEFINED_PAYLOAD',
        },
      });

      messenger.handle(payload);
      expect(eventHandler.mock.calls.length).toEqual(1);
    });

    it('Handles deliveries', () => {
      messenger.on('delivery', eventHandler);
      const payload = generatePayload('delivery', {
        mids: [
          'mid.1458668856218:ed81099e15d3f4f233',
        ],
        watermark: 1458668856253,
        seq: 37,
      });
      messenger.handle(payload);
      expect(eventHandler.mock.calls.length).toEqual(1);
    });

    it('Handles reads', () => {
      messenger.on('read', eventHandler);

      const payload = generatePayload('read', {
        watermark: 1458668856253,
        seq: 38,
      });

      messenger.handle(payload);
      expect(eventHandler.mock.calls.length).toEqual(1);
    });

    it('Handles postbacks', () => {
      messenger.on('postback', eventHandler);
      const payload = generatePayload('postback', {
        payload: 'USER_DEFINED_PAYLOAD',
      });

      messenger.handle(payload);
      expect(eventHandler.mock.calls.length).toEqual(1);
    });

    it('Handles optins', () => {
      messenger.on('optin', eventHandler);

      const payload = generatePayload('optin', {
        ref: 'PASS_THROUGH_PARAM',
      });

      messenger.handle(payload);
      expect(eventHandler.mock.calls.length).toEqual(1);
    });

    it('Handles account linking', () => {
      messenger.on('account_linking', eventHandler);

      const payload = generatePayload('account_linking', {
        status: 'linked',
        authorization_code: 'PASS_THROUGH_AUTHORIZATION_CODE',
      });

      messenger.handle(payload);
      expect(eventHandler.mock.calls.length).toEqual(1);
    });

    it('Handles referrals', () => {
      messenger.on('referral', eventHandler);

      const payload = generatePayload('referral', {
        ref: '<REF DATA PASSED IN M.ME PARAM>',
        source: 'SHORTLINK',
        type: 'OPEN_THREAD',
      });

      messenger.handle(payload);
      expect(eventHandler.mock.calls.length).toEqual(1);
    });

    it('Handles payments', () => {
      messenger.on('payment', eventHandler);

      const payload = generatePayload('payment', {
        payload: 'DEVELOPER_DEFINED_PAYLOAD',
        requested_user_info: {
          shipping_address: {
            street_1: '1 Hacker Way',
            street_2: '',
            city: 'MENLO PARK',
            state: 'CA',
            country: 'US',
            postal_code: 94025,
          },
          contact_name: 'Peter Chang',
          contact_email: 'peter@anemailprovider.com',
          contact_phone: '+15105551234',
        },
        payment_credential: {
          provider_type: 'stripe',
          charge_id: 'ch_18tmdBEoNIH3FPJHa60ep123',
          fb_payment_id: 123456789,
        },
        amount: {
          currency: 'USD',
          amount: 29.62,
        },
        shipping_option_id: 123,
      });

      messenger.handle(payload);
      expect(eventHandler.mock.calls.length).toEqual(1);
    });

    it('Handles checkout update', () => {
      messenger.on('checkout_update', eventHandler);

      const payload = generatePayload('checkout_update', {
        payload: 'DEVELOPER_DEFINED_PAYLOAD',
        shipping_address: {
          street_1: '1 Hacker Way',
          street_2: '',
          city: 'MENLO PARK',
          state: 'CA',
          country: 'US',
          postal_code: 94025,
        },
      });

      messenger.handle(payload);
      expect(eventHandler.mock.calls.length).toEqual(1);
    });

    it('Handles pre checkout', () => {
      messenger.on('pre_checkout', eventHandler);

      const payload = generatePayload('pre_checkout', {
        payload: 'xyz',
        requested_user_info: {
          shipping_address: {
            street_1: '1 Hacker Way',
            street_2: '',
            city: 'MENLO PARK',
            state: 'CA',
            country: 'US',
            postal_code: 94025,
          },
          contact_name: 'Tao Jiang',
        },
        amount: {
          currency: 'USD',
          amount: 29.62,
        },
      });

      messenger.handle(payload);
      expect(eventHandler.mock.calls.length).toEqual(1);
    });
  });

  describe('getUser', () => {
    it('returns JSON', (done) => {
      nock('https://graph.facebook.com')
        .get(/USER_ID/)
        .reply(200, {
          id: 123456,
          first_name: 'test',
          last_name: 'test',
          timezone: 0,
          locale: 'en_US',
        });
      messenger.getUser('USER_ID').then((user) => {
        try {
          expect(user).toHaveProperty('first_name');
          expect(user).toHaveProperty('id');
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('should throw error if no ID given', () => {
      expect(() => {
        messenger.getUser();
      }).toThrow('A user ID is required.');
    });
  });

  describe('send', () => {
    const payload = {
      recipient: {
        id: 'USER_ID',
      },
      message: {
        text: 'hello, world!',
      },
    };

    it('returns JSON', (done) => {
      nock('https://graph.facebook.com')
        .post('/v2.8/me/messages?access_token=PAGE_ACCESS_TOKEN')
        .reply(200, {
          recipient_id: '1008372609250235',
          message_id: 'mid.1456970487936:c34767dfe57ee6e339',
        });

      messenger.send(payload, 'USER_ID').then((resp) => {
        try {
          expect(resp).toHaveProperty('recipient_id');
          expect(resp).toHaveProperty('message_id');
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('should throw error if no ID given', () => {
      expect(() => {
        messenger.send(payload);
      }).toThrow('A user ID is required.');
    });
  });

  describe('sender actions', () => {
    beforeEach(() => {
      nock('https://graph.facebook.com')
      .post('/v2.8/me/messages?access_token=PAGE_ACCESS_TOKEN')
      .reply(200, {
        recipient_id: 'USER_ID',
        message_id: 'mid.1456970487936:c34767dfe57ee6e339',
      });
    });

    it('return JSON', (done) => {
      messenger.senderAction('typing_on', 'USER_ID').then((resp) => {
        try {
          expect(resp).toHaveProperty('recipient_id');
          expect(resp).toHaveProperty('message_id');
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('throws an error with an invalid sender action', () => {
      expect(() => {
        messenger.senderAction('wrong', 'USER_ID');
      }).toThrow('Invalid sender_action provided.');
    });

    it('should throw error if no ID given', () => {
      expect(() => {
        messenger.senderAction('typing_on');
      }).toThrow('A user ID is required.');
    });
  });

  describe('Attachment Upload API', () => {
    beforeEach(() => {
      nock('https://graph.facebook.com')
        .post('/v2.8/me/message_attachments?access_token=PAGE_ACCESS_TOKEN')
        .reply(200, {
          attachment_id: '1854626884821032',
        });
    });

    it('can upload a message attachments', (done) => {
      const payload = new Image({ url: 'http://test.com/image.jpg', is_reusable: true });
      messenger.messageAttachment(payload).then((resp) => {
        try {
          expect(resp).toHaveProperty('attachment_id');
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  describe('Subscribe app to a page', () => {
    beforeEach(() => {
      nock('https://graph.facebook.com')
        .post('/v2.8/me/subscribed_apps?access_token=PAGE_ACCESS_TOKEN')
        .reply(200, {
          result: true,
        });
    });

    it('can subscribe an app to a page', (done) => {
      messenger.subscribeAppToPage().then((resp) => {
        try {
          expect(resp).toHaveProperty('result');
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  describe('Thread settings', () => {
    beforeEach(() => {
      nock('https://graph.facebook.com')
        .post('/v2.8/me/thread_settings?access_token=PAGE_ACCESS_TOKEN')
        .reply(200, {
          result: true,
        });
      nock('https://graph.facebook.com')
        .delete('/v2.8/me/thread_settings?access_token=PAGE_ACCESS_TOKEN')
        .reply(200, {
          result: true,
        });
    });

    describe('setThreadSetting', () => {
      it('can set greeting text', (done) => {
        const payload = {
          setting_type: 'greeting',
          greeting: {
            text: 'Welcome to My Company!',
          },
        };
        messenger.setThreadSetting(payload).then((resp) => {
          try {
            expect(resp).toHaveProperty('result');
            done();
          } catch (e) {
            done(e);
          }
        });
      });
    });

    describe('deleteGetStarted', () => {
      it('can delete the get started button', (done) => {
        messenger.deleteGetStarted().then((resp) => {
          try {
            expect(resp).toHaveProperty('result');
            done();
          } catch (e) {
            done(e);
          }
        });
      });
    });

    describe('deleteGreetingText', () => {
      it('can delete the greeting text', (done) => {
        messenger.deleteGreetingText().then((resp) => {
          try {
            expect(resp).toHaveProperty('result');
            done();
          } catch (e) {
            done(e);
          }
        });
      });
    });

    describe('deletePersistentMenu', () => {
      it('can delete the persistent menu', (done) => {
        messenger.deletePersistentMenu().then((resp) => {
          try {
            expect(resp).toHaveProperty('result');
            done();
          } catch (e) {
            done(e);
          }
        });
      });
    });

    describe('whitelisted domains', () => {
      const domain = 'https://facebook.com';
      const domains = [
        'https://facebook.com',
        'https://developers.facebook.com',
      ];

      describe('Adding domains', () => {
        it('should throw an error if domain not given', () => {
          expect(() => {
            messenger.addWhitelistedDomain();
          }).toThrowError('A domain must be provided');
        });

        it('supports adding a single domain', (done) => {
          messenger.addWhitelistedDomain(domain).then((resp) => {
            try {
              expect(resp).toHaveProperty('result');
              done();
            } catch (e) {
              done(e);
            }
          });
        });

        it('should throw an error if no params given', () => {
          expect(() => {
            messenger.addWhitelistedDomains();
          }).toThrowError('An array of domains must be provided');
        });

        it('supports adding multiple domains', (done) => {
          messenger.addWhitelistedDomains(domains).then((resp) => {
            try {
              expect(resp).toHaveProperty('result');
              done();
            } catch (e) {
              done(e);
            }
          });
        });
      });

      describe('Removing domains', () => {
        it('should throw an error if domain not given', () => {
          expect(() => {
            messenger.removeWhitelistedDomain();
          }).toThrowError('A domain must be provided');
        });

        it('supports removing a single domain', (done) => {
          messenger.removeWhitelistedDomain(domain).then((resp) => {
            try {
              expect(resp).toHaveProperty('result');
              done();
            } catch (e) {
              done(e);
            }
          });
        });

        it('should throw an error if no params given when removing', () => {
          expect(() => {
            messenger.removeWhitelistedDomains();
          }).toThrowError('An array of domains must be provided');
        });

        it('supports removing multiple domains', (done) => {
          messenger.removeWhitelistedDomains(domains).then((resp) => {
            try {
              expect(resp).toHaveProperty('result');
              done();
            } catch (e) {
              done(e);
            }
          });
        });
      });

      describe('updateWhitelistedDomains', () => {
        it('should throw an error if domains is not an array', () => {
          expect(() => {
            messenger.updateWhitelistedDomains(domain);
          }).toThrowError('An array of domains must be provided');
        });

        it('works', (done) => {
          messenger.updateWhitelistedDomains('add', domains).then((resp) => {
            try {
              expect(resp).toHaveProperty('result');
              done();
            } catch (e) {
              done(e);
            }
          });
        });

        it('can remove a whitelisted domain', (done) => {
          messenger.updateWhitelistedDomains('remove', domains).then((resp) => {
            try {
              expect(resp).toHaveProperty('result');
              done();
            } catch (e) {
              done(e);
            }
          });
        });
      });
    });
  });

  describe('Account linking', () => {
    describe('linkAccount', () => {
      it('can link an account', (done) => {
        nock('https://graph.facebook.com')
          .get('/v2.8/me?fields=recipient&account_linking_token=ACCOUNT_LINKING_TOKEN&access_token=PAGE_ACCESS_TOKEN')
          .reply(200, {
            id: 'PAGE_ID',
            recipient: 'PSID',
          });

        messenger.linkAccount('ACCOUNT_LINKING_TOKEN').then((resp) => {
          try {
            expect(resp).toHaveProperty('id');
            expect(resp).toHaveProperty('recipient');
            done();
          } catch (e) {
            done(e);
          }
        });
      });
    });

    describe('unlinkAccount', () => {
      it('can unlink an account', (done) => {
        nock('https://graph.facebook.com')
          .post('/v2.8/me/unlink_accounts?access_token=PAGE_ACCESS_TOKEN')
          .reply(200, {
            result: 'unlink account success',
          });

        messenger.unlinkAccount('psid').then((resp) => {
          try {
            expect(resp).toHaveProperty('result');
            done();
          } catch (e) {
            done(e);
          }
        });
      });
    });
  });
});
