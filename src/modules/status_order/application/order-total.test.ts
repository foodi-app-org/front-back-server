import {
  computeExtrasTotal,
  computeLineBaseTotal,
  computeOrderTotal
} from './order-total'

describe('order-total', () => {
  describe('computeLineBaseTotal', () => {
    it('multiplies unit price by quantity', () => {
      expect(computeLineBaseTotal({ priceProduct: 1000, cantProducts: 3 })).toBe(3000)
    })

    it('returns 0 for a zero-priced base product (extra-only line)', () => {
      expect(computeLineBaseTotal({ priceProduct: 0, cantProducts: 2 })).toBe(0)
    })

    it('returns 0 when quantity is missing, zero or negative', () => {
      expect(computeLineBaseTotal({ priceProduct: 1000 })).toBe(0)
      expect(computeLineBaseTotal({ priceProduct: 1000, cantProducts: 0 })).toBe(0)
      expect(computeLineBaseTotal({ priceProduct: 1000, cantProducts: -2 })).toBe(0)
    })

    it('coerces string numerics coming from the DB', () => {
      expect(computeLineBaseTotal({ priceProduct: '1500.5', cantProducts: '2' })).toBe(3001)
    })

    it('guards non-finite values', () => {
      expect(computeLineBaseTotal({ priceProduct: Number.NaN, cantProducts: 2 })).toBe(0)
    })
  })

  describe('computeExtrasTotal', () => {
    it('sums extraPrice * quantity over selected extras', () => {
      expect(computeExtrasTotal([
        { extraPrice: 5000.5, quantity: 1 },
        { extraPrice: 2000, quantity: 2 }
      ])).toBe(9000.5)
    })

    it('ignores extras with quantity < 1 (not actually selected)', () => {
      expect(computeExtrasTotal([
        { extraPrice: 5000, quantity: 0 },
        { extraPrice: 5000, quantity: null },
        { extraPrice: 5000, quantity: 1 }
      ])).toBe(5000)
    })

    it('returns 0 for empty / null / undefined', () => {
      expect(computeExtrasTotal([])).toBe(0)
      expect(computeExtrasTotal(null)).toBe(0)
      expect(computeExtrasTotal(undefined)).toBe(0)
    })

    it('does not double count: only extraPrice * quantity', () => {
      expect(computeExtrasTotal([{ extraPrice: 100, quantity: 3 }])).toBe(300)
    })
  })

  describe('computeOrderTotal', () => {
    it('a single product with no extras', () => {
      expect(computeOrderTotal([{ priceProduct: 1000, cantProducts: 1 }])).toBe(1000)
    })

    it('several products with different quantities', () => {
      expect(computeOrderTotal([
        { priceProduct: 1000, cantProducts: 2 },
        { priceProduct: 500, cantProducts: 3 }
      ])).toBe(3500)
    })

    it('a product with extras adds base + extras', () => {
      expect(computeOrderTotal([
        { priceProduct: 1000, cantProducts: 1, dataExtra: [{ extraPrice: 250, quantity: 2 }] }
      ])).toBe(1500)
    })

    it('an extra-only sale (base 0, value in the complementos)', () => {
      expect(computeOrderTotal([
        { priceProduct: 0, cantProducts: 1, dataExtra: [{ extraPrice: 5000.5, quantity: 1 }] }
      ])).toBe(5000.5)
    })

    it('a genuine zero sale stays at 0', () => {
      expect(computeOrderTotal([{ priceProduct: 0, cantProducts: 1 }])).toBe(0)
      expect(computeOrderTotal([])).toBe(0)
      expect(computeOrderTotal(null)).toBe(0)
    })

    it('mixes base-only and extra-only lines', () => {
      expect(computeOrderTotal([
        { priceProduct: 1000, cantProducts: 2 },
        { priceProduct: 0, cantProducts: 1, dataExtra: [{ extraPrice: 500, quantity: 3 }] }
      ])).toBe(3500)
    })
  })
})
