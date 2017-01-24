import Adjustment from '../../src/elements/Adjustment';

describe('Adjustment', () => {
  describe('new', () => {
    it('returns proper object', () => {
      const adjustment = new Adjustment({
        name: 'Adjustment',
        amount: 20,
      });

      expect(adjustment).toEqual({
        name: 'Adjustment',
        amount: 20,
      });
    });

    it('allows just the name parameter', () => {
      const adjustment = new Adjustment({
        name: 'Adjustment',
      });

      expect(adjustment).toEqual({
        name: 'Adjustment',
        amount: '',
      });
    });

    it('allows just the amount parameter', () => {
      const adjustment = new Adjustment({
        amount: 20,
      });

      expect(adjustment).toEqual({
        name: '',
        amount: 20,
      });
    });
  });
});
