import { expect } from 'chai';

import Address from '../../lib/elements/Address';

describe('Address', () => {
  describe('new', () => {

    it('returns proper object', () => {
      let testAddress = {
        street_1: '1 Hacker Way',
        street_2: 'Facebook HQ',
        city: 'Menlo Park',
        postal_code: '94025',
        state: 'CA',
        country: 'US'
      };
      const address = new Address(testAddress);
      expect(address).to.deep.equal(testAddress);
    });

    it('returns proper object when street_2 is missing', () => {
      const address = new Address({
        street_1: '1 Hacker Way',
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
