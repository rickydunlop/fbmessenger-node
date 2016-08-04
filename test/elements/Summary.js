import { expect } from 'chai';

import Summary from '../../lib/elements/Summary';

describe('Summary', () => {
  describe('new', () => {
    it('returns proper object', () => {
      const summary = new Summary({
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

    it('returns proper object when just total_cost is passed', () => {
      const summary = new Summary({
        total_cost: 56.14
      });

      expect(summary).to.deep.equal({
        subtotal: '',
        shipping_cost: '',
        total_tax: '',
        total_cost: 56.14
      });
    });

  });
});
