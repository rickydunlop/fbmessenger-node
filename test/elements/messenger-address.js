import { expect } from 'chai';

import MessengerAddress from '../../lib/elements/messenger-address';

describe('MessengerAddress', () => {
  describe('new', () => {
    it('returns proper object', () => {
      const address = new MessengerAddress({
        street_1: '1 Hacker Way',
        street_2: '',
        city: 'Menlo Park',
        postal_code: '94025',
        state: 'CA',
        country: 'US'
      });

      expect(address).to.deep.equal({
        street_1: '1 Hacker Way',
        street_2: '',
        city: 'Menlo Park',
        postal_code: '94025',
        state: 'CA',
        country: 'US'
      });
    });
  });
});
