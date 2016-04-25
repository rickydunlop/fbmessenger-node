import { expect } from 'chai';

import MessengerAdjustment from '../../lib/elements/messenger-adjustment';

describe('MessengerAdjustment', () => {
  describe('new', () => {
    it('returns proper object', () => {
      const adjustment = new MessengerAdjustment('Adjustment', 20);

      expect(adjustment).to.deep.equal({
        name: 'Adjustment',
        amount: 20
      });
    });
  });
});
