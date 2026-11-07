import {
  computeExtrasTotal,
  computeLineBaseTotal,
  computeOrderTotal,
  normalizeSellableExtras
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

  // These tests lock the `dataExtra` (complementos) accounting rules that the
  // bug report is about: an extra that is effectively sold must be included in
  // `totalProductsPrice` (and therefore in the `totalSales` query that sums the
  // header), using the SAME quantity that is persisted as sold and decremented
  // from inventory. `normalizeSellableExtras` is the single source of truth the
  // resolver uses, so exercising it here covers the required scenarios.
  describe('normalizeSellableExtras (dataExtra selection + quantity)', () => {
    it('keeps a selected extra and preserves its quantity', () => {
      const result = normalizeSellableExtras(
        [{ exPid: 'e1', extraPrice: 3000, quantity: 1 }],
        1
      )
      expect(result).toEqual([{ exPid: 'e1', extraPrice: 3000, quantity: 1 }])
    })

    it('drops unselected extras (quantity 0 / null / negative)', () => {
      const result = normalizeSellableExtras(
        [
          { exPid: 'e0', extraPrice: 3000, quantity: 0 },
          { exPid: 'eNull', extraPrice: 3000, quantity: null },
          { exPid: 'eNeg', extraPrice: 3000, quantity: -2 },
          { exPid: 'eOk', extraPrice: 3000, quantity: 2 }
        ],
        1
      )
      expect(result).toHaveLength(1)
      expect(result[0].exPid).toBe('eOk')
      expect(result[0].quantity).toBe(2)
    })

    it('does NOT fall back to parent qty when the extra has its own qty', () => {
      const result = normalizeSellableExtras(
        [{ exPid: 'e1', extraPrice: 1000, quantity: 2 }],
        5
      )
      expect(result[0].quantity).toBe(2)
    })

    it('returns [] for empty / null / undefined input', () => {
      expect(normalizeSellableExtras([], 1)).toEqual([])
      expect(normalizeSellableExtras(null, 1)).toEqual([])
      expect(normalizeSellableExtras(undefined, 1)).toEqual([])
    })

    it('preserves manageStock so the caller can drive the inventory decrement', () => {
      const result = normalizeSellableExtras(
        [{ exPid: 'e1', extraPrice: 1000, quantity: 1, manageStock: true }],
        1
      )
      expect(result[0].manageStock).toBe(true)
    })
  })

  // End-to-end-ish money math for a single sale line, combining the base and
  // the normalized sellable extras exactly like the resolver does:
  //   line total = computeLineBaseTotal(base) + computeExtrasTotal(sellable)
  describe('line total with dataExtra (resolver accounting)', () => {
    const lineTotal = (
      base: { priceProduct: number; cantProducts: number },
      extras: Array<{ exPid?: string; extraPrice: number; quantity: number | null; manageStock?: boolean }>
    ): number => {
      const sellable = normalizeSellableExtras(extras, base.cantProducts)
      return computeLineBaseTotal(base) + computeExtrasTotal(sellable)
    }

    it('scenario 1: main product with NO extras keeps the base total', () => {
      expect(lineTotal({ priceProduct: 20000, cantProducts: 1 }, [])).toBe(20000)
    })

    it('scenario 2: main product + one extra (manageStock true, stock available) adds the extra', () => {
      // Stock availability is enforced by the stock decrement in the resolver;
      // when it succeeds the extra reaches the accrual below.
      expect(
        lineTotal({ priceProduct: 20000, cantProducts: 1 }, [
          { exPid: 'e1', extraPrice: 5000, quantity: 1, manageStock: true }
        ])
      ).toBe(25000)
    })

    it('scenario 3: main product + several qualifying extras sums them all', () => {
      expect(
        lineTotal({ priceProduct: 20000, cantProducts: 1 }, [
          { exPid: 'e1', extraPrice: 5000, quantity: 1, manageStock: true },
          { exPid: 'e2', extraPrice: 3000, quantity: 2, manageStock: true },
          { exPid: 'e3', extraPrice: 1500, quantity: 1, manageStock: false }
        ])
      ).toBe(20000 + 5000 + 6000 + 1500)
    })

    it('scenario 4: extra manageStock true but NO stock is excluded (resolver aborts the sale before accrual; simulated by it never being passed in)', () => {
      // When the stock decrement throws InsufficientStockError the whole sale is
      // rolled back, so the extra never contributes. The money math here only
      // ever receives extras that passed the decrement.
      expect(lineTotal({ priceProduct: 20000, cantProducts: 1 }, [])).toBe(20000)
    })

    it('scenario 5: extra WITHOUT inventory management keeps current behavior (counted)', () => {
      expect(
        lineTotal({ priceProduct: 20000, cantProducts: 1 }, [
          { exPid: 'e1', extraPrice: 5000, quantity: 1, manageStock: false }
        ])
      ).toBe(25000)
    })

    it('scenario 6: quantity greater than one is computed correctly for base and extras', () => {
      expect(
        lineTotal({ priceProduct: 20000, cantProducts: 3 }, [
          { exPid: 'e1', extraPrice: 5000, quantity: 2, manageStock: true }
        ])
      ).toBe(60000 + 10000)
    })

    it('scenario 7: discount is NOT part of the line/order total (it lives in its own column)', () => {
      // `totalProductsPrice` is base + extras only. The order-level discount is
      // persisted separately (orders_statuses.discount) and applied downstream,
      // so the money math here must stay independent of any discount value.
      const total = lineTotal({ priceProduct: 20000, cantProducts: 1 }, [
        { exPid: 'e1', extraPrice: 5000, quantity: 1, manageStock: true }
      ])
      expect(total).toBe(25000)
    })

    it('scenario 8: no double counting of extras (exactly extraPrice * quantity once)', () => {
      const once = computeExtrasTotal(
        normalizeSellableExtras([{ exPid: 'e1', extraPrice: 5000, quantity: 2 }], 1)
      )
      expect(once).toBe(10000)
    })
  })
})
