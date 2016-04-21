import EventEmitter from 'events';

class MessengerWrapper extends EventEmitter {
  constructor(opts) {
    super();

    opts = opts || {};

    if (!opts.verifyToken || !opts.pageAccessToken) {
      throw new Error('VERIFY_TOKEN or PAGE_ACCESS_TOKEN are missing.');
    }

    this.verifyToken = opts.verifyToken;
    this.pageAccessToken = opts.pageAccessToken;
  }
}

export default MessengerWrapper;
