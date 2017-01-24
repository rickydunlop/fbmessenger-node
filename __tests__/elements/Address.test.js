import Address from '../../src/elements/Address';

describe('Address', () => {
  let sampleAddress;

  beforeEach(() => {
    sampleAddress = {
      street_1: '1 Hacker Way',
      street_2: 'Facebook HQ',
      city: 'Menlo Park',
      postal_code: '94025',
      state: 'CA',
      country: 'US',
    };
  });

  describe('new', () => {
    it('returns proper object', () => {
      const address = new Address(sampleAddress);
      expect(address).toEqual(sampleAddress);
    });

    it('returns proper object when street_2 is missing', () => {
      delete sampleAddress.street_2;
      const address = new Address(sampleAddress);
      expect(address).toEqual({
        street_1: '1 Hacker Way',
        street_2: '',
        city: 'Menlo Park',
        postal_code: '94025',
        state: 'CA',
        country: 'US',
      });
    });
  });
});
