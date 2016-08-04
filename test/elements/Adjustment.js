import { expect } from 'chai';

import Adjustment from '../../lib/elements/Adjustment';

describe('Adjustment', () => {
  describe('new', () => {
    it('returns proper object', () => {
      const adjustment = new Adjustment({
        'name': 'Adjustment',
        'amount': 20
      });

      expect(adjustment).to.deep.equal({
        name: 'Adjustment',
        amount: 20
      });
    });

    it('allows just the name parameter', () => {
      const adjustment = new Adjustment({
        'name': 'Adjustment'
      });

      expect(adjustment).to.deep.equal({
        name: 'Adjustment',
        amount: ''
      });
    });

    it('allows just the amount parameter', () => {
      const adjustment = new Adjustment({
        amount: 20
      });

      expect(adjustment).to.deep.equal({
        name: '',
        amount: 20
      });
    });

  });
});
