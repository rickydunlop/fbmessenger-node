import { expect } from 'chai';

import MessengerSummary from '../../lib/elements/messenger-summary';

describe('MessengerSummary', () => {
  describe('new', () => {
    it('returns proper object', () => {
      const summary = new MessengerSummary({
        subtotal: 75.00,
        shipping_cost: 4.95,
        total_tax: 6.19,
        total_cost: 56.14
      });

      expect(summary).to.deep.equal({
        subtotal: 75.00,
        shipping_cost: 4.95,
        total_tax: 6.19,
        total_cost: 56.14
      });
    });
  });
});
