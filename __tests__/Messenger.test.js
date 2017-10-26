import nock from 'nock';

import { Messenger } from '../src/Messenger';
import {
  FB_API_VERSION,
  GET_STARTED_LIMIT,
  WHITELISTED_DOMAIN_MAX,
} from '../src/constants';
import {
  GreetingText,
} from '../src/messenger_profile';
import Image from '../src/attachments/Image';

const messenger = new Messenger({
  pageAccessToken: 'PAGE_ACCESS_TOKEN',
});

const generatePayload = (key, payload) => {
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
};

describe('Messenger', () => {
  describe('Create', () => {
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

  describe('User', () => {
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

  describe('Send', () => {
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
        .post(`/${FB_API_VERSION}/me/messages?access_token=PAGE_ACCESS_TOKEN`)
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

    it('allows a tag to be included', (done) => {
      nock('https://graph.facebook.com')
        .post(`/${FB_API_VERSION}/me/messages?access_token=PAGE_ACCESS_TOKEN`)
        .reply(200, {
          recipient_id: '1008372609250235',
          message_id: 'mid.1456970487936:c34767dfe57ee6e339',
        });

      messenger.send(payload, 'USER_ID', 'SHIPPING_UPDATE').then((resp) => {
        try {
          expect(resp).toHaveProperty('recipient_id');
          expect(resp).toHaveProperty('message_id');
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('errors if no ID given', () => {
      expect(() => {
        messenger.send(payload);
      }).toThrow('A user ID is required.');
    });

    it('errors if given an invalid tag', () => {
      expect(() => {
        messenger.send(payload, 'USER_ID', 'WRONG_TAG');
      }).toThrow('Invalid tag provided.');
    });
  });

  describe('Sender actions', () => {
    beforeEach(() => {
      nock('https://graph.facebook.com')
        .post(`/${FB_API_VERSION}/me/messages?access_token=PAGE_ACCESS_TOKEN`)
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
        .post(`/${FB_API_VERSION}/me/message_attachments?access_token=PAGE_ACCESS_TOKEN`)
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

  describe('Messenger Code API', () => {
    beforeEach(() => {
      nock('https://graph.facebook.com')
        .post(`/${FB_API_VERSION}/me/messenger_codes?access_token=PAGE_ACCESS_TOKEN`)
        .reply(200, {
          uri: 'YOUR_CODE_URL_HERE',
        });
    });

    it('can generate a code', (done) => {
      messenger.messengerCode({ image_size: 1000 }).then((resp) => {
        try {
          expect(resp).toHaveProperty('uri');
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('can generate a parametric code', (done) => {
      messenger.messengerCode({ image_size: 1000, ref: 'REF' }).then((resp) => {
        try {
          expect(resp).toHaveProperty('uri');
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('should throw error if the ref is invalid', () => {
      expect(() => {
        messenger.messengerCode({ ref: '£REF' });
      }).toThrow('Invalid ref provided: £REF');
    });

    it('should throw error if the size is too small', () => {
      expect(() => {
        messenger.messengerCode({ image_size: 50 });
      }).toThrow('Size Supported range: 100-2000 px');
    });

    it('should throw error if the size is too big', () => {
      expect(() => {
        messenger.messengerCode({ image_size: 3000 });
      }).toThrow('Size Supported range: 100-2000 px');
    });
  });

  describe('Subscribe app to a page', () => {
    beforeEach(() => {
      nock('https://graph.facebook.com')
        .post(`/${FB_API_VERSION}/me/subscribed_apps?access_token=PAGE_ACCESS_TOKEN`)
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

  describe('NLP', () => {
    beforeEach(() => {
      nock('https://graph.facebook.com')
        .post(`/${FB_API_VERSION}/me/nlp_configs?nlp_enabled=true&access_token=PAGE_ACCESS_TOKEN`)
        .reply(200, {
          result: true,
        });
      nock('https://graph.facebook.com')
        .post(`/${FB_API_VERSION}/me/nlp_configs?nlp_enabled=true&custom_token=token&access_token=PAGE_ACCESS_TOKEN`)
        .reply(200, {
          result: true,
        });
    });

    it('can enable nlp', (done) => {
      messenger.setNLP(true).then((resp) => {
        try {
          expect(resp).toHaveProperty('result');
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('can set custom token', (done) => {
      messenger.setNLP(true, 'token').then((resp) => {
        try {
          expect(resp).toHaveProperty('result');
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  describe('Messenger Profile', () => {
    describe('Network calls', () => {
      const successResponse = { result: 'success' };
      beforeEach(() => {
        nock('https://graph.facebook.com')
          .get(`/${FB_API_VERSION}/me/messenger_profile`)
          .query({
            fields: 'get_started',
            access_token: 'PAGE_ACCESS_TOKEN',
          })
          .reply(200, successResponse);
      });

      it('can read profile settings', (done) => {
        messenger.getMessengerProfile('get_started').then((res) => {
          try {
            expect(res).toEqual(successResponse);
            done();
          } catch (e) {
            done(e);
          }
        });
      });

      it('will convert array params to comma separated string', (done) => {
        const fields = [
          'get_started',
        ];
        messenger.getMessengerProfile(fields).then((res) => {
          try {
            expect(res).toEqual(successResponse);
            done();
          } catch (e) {
            done(e);
          }
        });
      });

      it('can set profile settings', (done) => {
        const payload = {
          get_started: {
            payload: 'GET_STARTED_PAYLOAD',
          },
        };

        nock('https://graph.facebook.com')
          .post(`/${FB_API_VERSION}/me/messenger_profile`)
          .query({
            access_token: 'PAGE_ACCESS_TOKEN',
          })
          .reply(200, successResponse);

        messenger.setMessengerProfile(payload).then((res) => {
          try {
            expect(res).toEqual(successResponse);
            done();
          } catch (e) {
            done(e);
          }
        });
      });

      describe('delete', () => {
        beforeEach(() => {
          nock('https://graph.facebook.com')
            .delete(`/${FB_API_VERSION}/me/messenger_profile?access_token=PAGE_ACCESS_TOKEN`)
            .reply(200, successResponse);
        });

        it('can delete profile settings', (done) => {
          messenger.deleteMessengerProfile(['get_started']).then((res) => {
            try {
              expect(res).toEqual(successResponse);
              done();
            } catch (e) {
              done(e);
            }
          });
        });

        it('converts params to an array', (done) => {
          messenger.deleteMessengerProfile('get_started').then((res) => {
            try {
              expect(res).toEqual(successResponse);
              done();
            } catch (e) {
              done(e);
            }
          });
        });
      });
    });

    describe('Methods', () => {
      let mockGetMessengerProfile;
      let mockSetMessengerProfile;
      let mockDeleteMessengerProfile;

      beforeEach(() => {
        mockGetMessengerProfile = jest.fn();
        mockSetMessengerProfile = jest.fn();
        mockDeleteMessengerProfile = jest.fn();
        messenger.getMessengerProfile = mockGetMessengerProfile;
        messenger.setMessengerProfile = mockSetMessengerProfile;
        messenger.deleteMessengerProfile = mockDeleteMessengerProfile;
      });

      describe('Get Started', () => {
        it('can set the payload', () => {
          const payload = 'USER_DEFINED_PAYLOAD';
          messenger.setGetStarted(payload);
          expect(mockSetMessengerProfile.mock.calls.length).toBe(1);
        });

        it('can delete the button', () => {
          messenger.deleteGetStarted();
          expect(mockDeleteMessengerProfile.mock.calls.length).toBe(1);
          expect(mockDeleteMessengerProfile.mock.calls[0][0]).toEqual(['get_started']);
        });

        it('should throw an error if the payload is too long', () => {
          expect(() => {
            const payload = 'x'.repeat(1001);
            messenger.setGetStarted(payload);
          }).toThrowError(`Get Started payload limit is ${GET_STARTED_LIMIT}.`);
        });
      });

      describe('Greeting Text', () => {
        it('can set the greeting text', () => {
          const greeting = new GreetingText({ text: 'Welcome to My Company!' });
          messenger.setGreetingText([greeting]);
          expect(mockSetMessengerProfile.mock.calls.length).toBe(1);
        });

        it('converts single greeting to an array', () => {
          const greeting = new GreetingText({ text: 'Welcome to My Company!' });
          messenger.setGreetingText(greeting);
          expect(mockSetMessengerProfile.mock.calls.length).toBe(1);
          expect(mockSetMessengerProfile.mock.calls[0][0]).toEqual({
            greeting: [
              { text: 'Welcome to My Company!', locale: 'default' },
            ],
          });
        });

        it('can delete the greeting text', () => {
          messenger.deleteGreetingText();
          expect(mockDeleteMessengerProfile.mock.calls.length).toBe(1);
          expect(mockDeleteMessengerProfile.mock.calls[0][0]).toEqual(['greeting']);
        });

        it('should throw an error if no default locale is provided', () => {
          expect(() => {
            const greeting = {
              text: 'Text',
              locale: 'en_US',
            };
            messenger.setGreetingText([greeting]);
          }).toThrowError('You must provide a default locale');
        });
      });

      describe('whitelisted domains', () => {
        it('can set a domain whitelist', () => {
          const domains = [
            'https://facebook.com',
          ];
          messenger.setDomainWhitelist(domains);
          expect(mockSetMessengerProfile.mock.calls.length).toBe(1);
        });

        it('should throw an error if no parameters are supplied', () => {
          expect(() => {
            messenger.setDomainWhitelist();
          }).toThrowError('A domain must be provided.');
        });

        it('should throw an error if too many domains are provided', () => {
          expect(() => {
            const maxDomains = Array(WHITELISTED_DOMAIN_MAX + 1).fill('http://example.com');
            messenger.setDomainWhitelist(maxDomains);
          }).toThrowError(`You may only whitelist ${WHITELISTED_DOMAIN_MAX} domains.`);
        });

        it('can delete a domain whitelist', () => {
          messenger.deleteDomainWhitelist();
          expect(mockDeleteMessengerProfile.mock.calls.length).toBe(1);
          expect(mockDeleteMessengerProfile.mock.calls[0][0]).toEqual(['whitelisted_domains']);
        });
      });

      describe('home url', () => {
        it('can set a home url', () => {
          messenger.setHomeURL('https://facebook.com');
          expect(mockSetMessengerProfile.mock.calls.length).toBe(1);
        });

        it('should throw an error if no parameters are supplied', () => {
          expect(() => {
            messenger.setHomeURL();
          }).toThrowError('A URL must be provided.');
        });

        it('can delete a home url', () => {
          messenger.deleteHomeURL();
          expect(mockDeleteMessengerProfile.mock.calls.length).toBe(1);
          expect(mockDeleteMessengerProfile.mock.calls[0][0]).toEqual(['home_url']);
        });
      });

      describe('target audience', () => {
        it('can set the target audience', () => {
          messenger.setTargetAudience({
            audience_type: 'custom',
            countries: {
              whitelist: ['US', 'CA'],
            },
          });
          expect(mockSetMessengerProfile.mock.calls.length).toBe(1);
        });

        it('should throw an error if no parameters are supplied', () => {
          expect(() => {
            messenger.setTargetAudience();
          }).toThrowError('A target audience must be provided.');
        });

        it('can delete a target audience', () => {
          messenger.deleteTargetAudience();
          expect(mockDeleteMessengerProfile.mock.calls.length).toBe(1);
          expect(mockDeleteMessengerProfile.mock.calls[0][0]).toEqual(['target_audience']);
        });
      });

      describe('payment settings', () => {
        it('can set the payment settings', () => {
          messenger.setPaymentSettings({
            public_key: 'YOUR_PUBLIC_KEY',
            testers: [
              12345678,
            ],
          });
          expect(mockSetMessengerProfile.mock.calls.length).toBe(1);
        });

        it('should throw an error if no parameters are supplied', () => {
          expect(() => {
            messenger.setPaymentSettings();
          }).toThrowError('Payment settings must be provided.');
        });

        it('can delete payment settings', () => {
          messenger.deletePaymentSettings();
          expect(mockDeleteMessengerProfile.mock.calls.length).toBe(1);
          expect(mockDeleteMessengerProfile.mock.calls[0][0]).toEqual(['payment_settings']);
        });
      });

      describe('account linking url', () => {
        it('can set the account linking url', () => {
          const url = 'https://example.com/oauth?response_type=code&client_id=1234567890&scope=basic';
          messenger.setAccountLinkingURL(url);
          expect(mockSetMessengerProfile.mock.calls.length).toBe(1);
        });

        it('should throw an error if no parameters are supplied', () => {
          expect(() => {
            messenger.setAccountLinkingURL();
          }).toThrowError('A URL must be provided.');
        });

        it('can delete account linking url', () => {
          messenger.deleteAccountLinkingURL();
          expect(mockDeleteMessengerProfile.mock.calls.length).toBe(1);
          expect(mockDeleteMessengerProfile.mock.calls[0][0]).toEqual(['account_linking_url']);
        });
      });

      describe('persistent menu', () => {
        it('can set the persistent menu', () => {
          const menu = [{
            locale: 'default',
            call_to_actions: [
              {
                type: 'web_url',
                title: 'Help',
                url: 'http://facebook.com',
              },
            ],
          }];
          messenger.setPersistentMenu(menu);
          expect(mockSetMessengerProfile.mock.calls.length).toBe(1);
        });

        it('should convert a single menu into an array', () => {
          const menu = {
            locale: 'default',
            call_to_actions: [
              {
                type: 'web_url',
                title: 'Help',
                url: 'http://facebook.com',
              },
            ],
          };
          messenger.setPersistentMenu(menu);
          expect(mockSetMessengerProfile.mock.calls.length).toBe(1);
        });

        it('should throw an error if no default locale is provided', () => {
          expect(() => {
            const item = [
              {
                call_to_actions: [
                  {
                    type: 'web_url',
                    title: 'Help',
                    url: 'http://facebook.com',
                  },
                ],
              },
              {
                locale: 'zh_CN',
                composer_input_disabled: false,
              },
            ];
            messenger.setPersistentMenu(item);
          }).toThrowError('You must provide a default locale');
        });

        it('can delete persistent menu', () => {
          messenger.deletePersistentMenu();
          expect(mockDeleteMessengerProfile.mock.calls.length).toBe(1);
          expect(mockDeleteMessengerProfile.mock.calls[0][0]).toEqual(['persistent_menu']);
        });
      });
    });
  });
});
