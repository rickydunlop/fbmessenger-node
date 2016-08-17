import sinon from 'sinon';
import { expect } from 'chai';
import fetchMock from 'fetch-mock';

import { Messenger } from '../lib/Messenger';

describe('Messenger', () => {
  describe('new', () => {
    describe('with all attributes', () => {
      it('initializes correctly', () => {
        const client = new Messenger({
          pageAccessToken: 'page_access_token'
        });

        expect(client).to.be.ok;
      });
    });

    describe('with an attribute missing', () => {
      it('throws an error', () => {
        expect(() => {
          new Messenger();
        }).to.throw(Error, 'PAGE_ACCESS_TOKEN is missing.');
      });
    });
  });

  describe('Events', () => {
    it('Handles message', () => {
      const messenger = new Messenger({
        pageAccessToken: 'page_access_token'
      });
      var spy = sinon.spy();

      messenger.on('message', spy);

      let payload = {
        'object': 'page',
        'entry': [
          {
            'id': 1234,
            'time': 1457764198246,
            'messaging': [
              {
                'sender': {
                  'id': 1234
                },
                'recipient': {
                  'id': 1234
                },
                'timestamp': 1457764197627,
                'message':{
                  'mid':'mid.1457764197618:41d102a3e1ae206a38',
                  'seq':73,
                  'text':'hello, world!',
                  'quick_reply': {
                    'payload': 'DEVELOPER_DEFINED_PAYLOAD'
                  }
                }
              }
            ]
          }
        ]
      };
      messenger.handle(payload);
      expect(spy).to.have.been.called;
    });

    it('Handles deliveries', () => {
      const messenger = new Messenger({
        pageAccessToken: 'page_access_token'
      });
      var spy = sinon.spy();

      messenger.on('delivery', spy);

      let payload = {
        'object': 'page',
        'entry': [
          {
            'id': 1234,
            'time': 1457764198246,
            'messaging': [
              {
                'sender': {
                  'id': 1234
                },
                'recipient': {
                  'id': 1234
                },
                'timestamp': 1457764197627,
                'delivery':{
                  'mids':[
                    'mid.1458668856218:ed81099e15d3f4f233'
                  ],
                  'watermark':1458668856253,
                  'seq':37
                }
              }
            ]
          }
        ]
      };
      messenger.handle(payload);
      expect(spy).to.have.been.called;
    });

    it('Handles reads', () => {
      const messenger = new Messenger({
        pageAccessToken: 'page_access_token'
      });
      var spy = sinon.spy();

      messenger.on('read', spy);

      let payload = {
        'object': 'page',
        'entry': [
          {
            'id': 1234,
            'time': 1457764198246,
            'messaging': [
              {
                'sender': {
                  'id': 1234
                },
                'recipient': {
                  'id': 1234
                },
                'timestamp': 1457764197627,
                'read':{
                  'watermark':1458668856253,
                  'seq':38
                }
              }
            ]
          }
        ]
      };
      messenger.handle(payload);
      expect(spy).to.have.been.called;
    });

    it('Handles postbacks', () => {
      const messenger = new Messenger({
        pageAccessToken: 'page_access_token'
      });
      var spy = sinon.spy();

      messenger.on('postback', spy);

      let payload = {
        'object': 'page',
        'entry': [
          {
            'id': 1234,
            'time': 1457764198246,
            'messaging': [
              {
                'sender': {
                  'id': 1234
                },
                'recipient': {
                  'id': 1234
                },
                'timestamp': 1457764197627,
                'postback':{
                  'payload':'USER_DEFINED_PAYLOAD'
                }
              }
            ]
          }
        ]
      };
      messenger.handle(payload);
      expect(spy).to.have.been.called;
    });

    it('Handles optins', () => {
      const messenger = new Messenger({
        pageAccessToken: 'page_access_token'
      });
      var spy = sinon.spy();

      messenger.on('optin', spy);

      let payload = {
        'object': 'page',
        'entry': [
          {
            'id': 1234,
            'time': 1457764198246,
            'messaging': [
              {
                'sender': {
                  'id': 1234
                },
                'recipient': {
                  'id': 1234
                },
                'timestamp': 1457764197627,
                'optin':{
                  'ref':'PASS_THROUGH_PARAM'
                }
              }
            ]
          }
        ]
      };
      messenger.handle(payload);
      expect(spy).to.have.been.called;
    });

    it('Handles account linking', () => {
      const messenger = new Messenger({
        pageAccessToken: 'page_access_token'
      });
      var spy = sinon.spy();

      messenger.on('account_linking', spy);

      let payload = {
        'object': 'page',
        'entry': [
          {
            'id': 1234,
            'time': 1457764198246,
            'messaging': [
              {
                'sender': {
                  'id': 1234
                },
                'recipient': {
                  'id': 1234
                },
                'timestamp': 1457764197627,
                'account_linking': {
                  'status':'linked',
                  'authorization_code':'PASS_THROUGH_AUTHORIZATION_CODE'
                }
              }
            ]
          }
        ]
      };
      messenger.handle(payload);
      expect(spy).to.have.been.called;
    });
  });

  describe('get user', () => {
    it('calls get user', () => {
      let messenger = new Messenger({
        pageAccessToken: 'PAGE_ACCESS_TOKEN'
      });
      messenger.lastMessage = {
        'sender':{
          'id':'USER_ID'
        },
        'recipient':{
          'id':'PAGE_ID'
        }
      };
      let mockGetUser = sinon.spy(messenger, 'getUser');
      messenger.getUser();
      expect(mockGetUser.callCount).to.equal(1);
    });
  });

  describe('send', () => {
    it('calls send', () => {
      let messenger = new Messenger({
        pageAccessToken: 'PAGE_ACCESS_TOKEN'
      });
      messenger.lastMessage = {
        'sender':{
          'id':'USER_ID'
        },
        'recipient':{
          'id':'PAGE_ID'
        }
      };

      let payload = {
        'recipient':{
          'id':'USER_ID'
        },
        'message':{
          'text':'hello, world!'
        }
      };

      let mockSend = sinon.spy(messenger, 'send');
      messenger.send(payload);
      expect(mockSend.callCount).to.equal(1);
    });
  });
});
