import sinon from 'sinon';
import { expect } from 'chai';

import { Messenger } from '../lib/Messenger';

const messenger = new Messenger({
  pageAccessToken: 'page_access_token',
});

messenger.lastMessage = {
  sender: {
    id: 'USER_ID',
  },
  recipient: {
    id: 'PAGE_ID',
  },
};

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
      it('initializes correctly', () => expect(messenger).to.be.ok);
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
      const spy = sinon.spy();

      messenger.on('message', spy);
      const payload = generatePayload('message', {
        mid: 'mid.1457764197618:41d102a3e1ae206a38',
        seq: 73,
        text: 'hello, world!',
        quick_reply: {
          payload: 'DEVELOPER_DEFINED_PAYLOAD',
        },
      });

      messenger.handle(payload);
      expect(spy.callCount).to.equal(1);
    });

    it('Handles deliveries', () => {
      const spy = sinon.spy();

      messenger.on('delivery', spy);
      const payload = generatePayload('delivery', {
        mids: [
          'mid.1458668856218:ed81099e15d3f4f233',
        ],
        watermark: 1458668856253,
        seq: 37,
      });
      messenger.handle(payload);
      expect(spy.callCount).to.equal(1);
    });

    it('Handles reads', () => {
      const spy = sinon.spy();
      messenger.on('read', spy);

      const payload = generatePayload('read', {
        watermark: 1458668856253,
        seq: 38,
      });

      messenger.handle(payload);
      expect(spy.callCount).to.equal(1);
    });

    it('Handles postbacks', () => {
      const spy = sinon.spy();
      messenger.on('postback', spy);
      const payload = generatePayload('postback', {
        payload: 'USER_DEFINED_PAYLOAD',
      });

      messenger.handle(payload);
      expect(spy.callCount).to.equal(1);
    });

    it('Handles optins', () => {
      const spy = sinon.spy();
      messenger.on('optin', spy);

      const payload = generatePayload('optin', {
        ref: 'PASS_THROUGH_PARAM',
      });

      messenger.handle(payload);
      expect(spy.callCount).to.equal(1);
    });

    it('Handles account linking', () => {
      const spy = sinon.spy();
      messenger.on('account_linking', spy);

      const payload = generatePayload('account_linking', {
        status: 'linked',
        authorization_code: 'PASS_THROUGH_AUTHORIZATION_CODE',
      });

      messenger.handle(payload);
      expect(spy.callCount).to.equal(1);
    });
  });

  describe('get user', () => {
    const mockGetUser = sinon.spy(messenger.client, 'getUser');
    it('calls get user', () => {
      messenger.getUser();
      expect(mockGetUser.callCount).to.equal(1);
    });

    it('calls get user with an ID', () => {
      messenger.getUser(123);
      expect(mockGetUser.callCount).to.equal(2);
      expect(mockGetUser.calledWith(123)).to.equal(true);
    });
  });

  describe('send', () => {
    afterEach(() => {
      messenger.client.send.restore();
    });

    it('calls send', () => {
      const payload = {
        recipient: {
          id: 'USER_ID',
        },
        message: {
          text: 'hello, world!',
        },
      };

      const mock = sinon.spy(messenger.client, 'send');
      messenger.send(payload);
      expect(mock.callCount).to.equal(1);
    });

    it('accepts an id', () => {
      const payload = {
        recipient: {
          id: 'USER_ID',
        },
        message: {
          text: 'hello, world!',
        },
      };

      const mock = sinon.spy(messenger.client, 'send');
      messenger.send(payload, 1234);
      expect(mock.callCount).to.equal(1);
    });
  });

  describe('sender actions', () => {
    const mock = sinon.spy(messenger.client, 'senderAction');

    it('calls correct method', () => {
      messenger.senderAction('typing_on');
      expect(mock.callCount).to.equal(1);
      expect(mock.calledWith('typing_on')).to.be.true;
    });

    it('accepts an id', () => {
      messenger.senderAction('typing_on', 1234);
      expect(mock.callCount).to.equal(2);
      expect(mock.calledWith('typing_on', 1234)).to.be.true;
    });
  });

  describe('setThreadSetting', () => {
    it('calls correct method', () => {
      const mock = sinon.spy(messenger.client, 'setThreadSetting');
      messenger.setThreadSetting();
      expect(mock.callCount).to.equal(1);
    });
  });

  describe('subscribeAppToPage', () => {
    it('calls correct method', () => {
      const mock = sinon.spy(messenger.client, 'subscribeAppToPage');
      messenger.subscribeAppToPage();
      expect(mock.callCount).to.equal(1);
    });
  });

  describe('deleteGetStarted', () => {
    it('calls correct method', () => {
      const mock = sinon.spy(messenger.client, 'deleteGetStarted');
      messenger.deleteGetStarted();
      expect(mock.callCount).to.equal(1);
    });
  });

  describe('deleteGreetingText', () => {
    it('calls correct method', () => {
      const mock = sinon.spy(messenger.client, 'deleteGreetingText');
      messenger.deleteGreetingText();
      expect(mock.callCount).to.equal(1);
    });
  });

  describe('deletePersistentMenu', () => {
    it('calls correct method', () => {
      const mock = sinon.spy(messenger.client, 'deletePersistentMenu');
      messenger.deletePersistentMenu();
      expect(mock.callCount).to.equal(1);
    });
  });

  describe('linkAccount', () => {
    it('calls correct method', () => {
      const mock = sinon.spy(messenger.client, 'linkAccount');
      messenger.linkAccount();
      expect(mock.callCount).to.equal(1);
    });
  });

  describe('unlinkAccount', () => {
    it('calls correct method', () => {
      const mock = sinon.spy(messenger.client, 'unlinkAccount');
      messenger.unlinkAccount();
      expect(mock.callCount).to.equal(1);
    });
  });

  describe('whitelisted domains', () => {
    it('calls correct method', () => {
      const mock = sinon.spy(messenger.client, 'updateWhitelistedDomains');

      messenger.addWhitelistedDomain();
      messenger.addWhitelistedDomains();
      messenger.removeWhitelistedDomain();
      messenger.removeWhitelistedDomains();

      expect(mock.callCount).to.equal(4);
    });
  });
});
