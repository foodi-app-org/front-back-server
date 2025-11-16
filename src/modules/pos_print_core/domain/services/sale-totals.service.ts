/**
 * cart-totals.ts
 *
 * Production-ready implementation for computing shopping cart totals.
 * Includes VAT, discounts, extras, per-store breakdown, and global discount.
 * Clean, scalable, maintainable, and Papu-approved 😎.
 */

/* ============================
 * Types
 * ============================ */

export interface ReadonlyExtra {
  readonly id?: string;
  readonly name?: string;
  readonly extraPrice: number | string | null;
  readonly quantity?: number | string | null;
}

export interface ReadonlyProducts {
  readonly dataExtra?: ReadonlyArray<ReadonlyExtra> | null;
  readonly dataOptional?: ReadonlyArray<ReadonlyExtra> | null;
  readonly [k: string]: unknown;
}

export interface ReadonlyCartItem {
  readonly shoppingCartId?: string | null;
  readonly id: string;
  readonly idUser?: string | null;
  readonly idStore?: string | null;
  readonly priceProduct?: number | string | null;
  readonly ProPrice?: number | string | null;
  readonly cantProducts?: number | string | null;
  readonly quantity?: number | string | null;
  readonly vat?: number | string | null;
  readonly discount?: number | string | null;
  readonly products?: ReadonlyProducts | null;
  readonly [k: string]: unknown;
}

export interface ComputeOptions {
  readonly currencySymbol?: string;
  readonly rounding?: number;
  readonly treatProPriceAs?: 'priceProduct' | 'ProPrice';
  readonly includeExtras?: boolean;
  readonly vat?: number;
  readonly discount?: number;

  /** New global discount (%) applied to final grandTotal */
  readonly globalDiscountPercent?: number;
}

export interface LineDetail {
  readonly id: string;
  readonly unitPrice: number;
  readonly quantity: number;
  readonly extrasTotal: number;
  readonly lineSubtotal: number;
  readonly vatAmount: number;
  readonly discountAmount: number;
}

export interface StoreTotals {
  readonly subtotal: number;
  readonly totalExtras: number;
  readonly totalVat: number;
  readonly totalDiscounts: number;
  readonly grandTotal: number;
}

export interface CartTotals {
  readonly subtotal: number;
  readonly totalExtras: number;
  readonly totalVat: number;
  readonly totalDiscounts: number;
  readonly grandTotal: number;

  /** New: Total discount applied to the grand total globally */
  readonly globalDiscountValue: number;

  /** New: Percentage applied */
  readonly globalDiscountPercent: number;

  /** New: Grand total *after* global discount */
  readonly grandTotalAfterGlobalDiscount: number;

  readonly breakdownByStore: Readonly<Record<string, StoreTotals>>;
  readonly lines: ReadonlyArray<LineDetail>;
}

/* ============================
 * Defaults
 * ============================ */

export const defaultComputeOptions: ComputeOptions = {
  currencySymbol: '$',
  rounding: 0,
  treatProPriceAs: 'priceProduct',
  includeExtras: true,
  globalDiscountPercent: 0,
};

/* ============================
 * Helpers
 * ============================ */

/**
 * Parse a required numeric value.
 * @param {number | string | null | undefined} value
 * @param {string} fieldName
 * @returns {number}
 * @throws {Error}
 */
function parseNumber(value: number | string | null | undefined, fieldName: string): number {
  if (value === null || value === undefined || value === '') {
    throw new Error(`${fieldName} is required but was ${String(value)}.`);
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error(`${fieldName} must be a finite number.`);
    return value;
  }

  if (typeof value === 'string') {
    const cleaned = value.replace(/[, ]+/g, '');
    const parsed = Number(cleaned);
    if (!Number.isFinite(parsed)) {
      throw new Error(`${fieldName} string value '${value}' is not a valid number.`);
    }
    return parsed;
  }

  throw new Error(`${fieldName} has unsupported type: ${typeof value}`);
}

/**
 * Parse an optional numeric value.
 * @param {number | string | null | undefined} value
 * @param {number} [defaultVal=0]
 * @returns {number}
 */
function parseOptionalNumber(
  value: number | string | null | undefined,
  defaultVal = 0
): number {
  if (value === null || value === undefined || value === '') return defaultVal;
  return parseNumber(value, 'optionalNumber');
}

/**
 * Raw rounder (Papu wanted exact totals 😎).
 */
function round(value: number): number {
  return value;
}

/* ============================
 * Core Implementation
 * ============================ */

/**
 * Computes full cart totals with VAT, discounts, extras, per-store breakdown
 * and a global discount applied to the final grand total.
 *
 * @param {ReadonlyArray<ReadonlyCartItem>} cart
 * @param {ComputeOptions} opts
 * @returns {CartTotals}
 * @throws {Error}
 */
export function computeCartTotals(
  cart: ReadonlyArray<ReadonlyCartItem>,
  opts?: ComputeOptions
): CartTotals {
  const cfg: ComputeOptions = { ...defaultComputeOptions, ...(opts || {}) };

  if (!Array.isArray(cart)) {
    throw new Error('cart must be an array of items.');
  }

  let subtotalAcc = 0;
  let totalExtrasAcc = 0;
  let totalVatAcc = cfg.vat ?? 0;
  let totalDiscountsAcc = 0;

  const lines: LineDetail[] = [];
  const storeMap = new Map<
    string,
    { subtotal: number; totalExtras: number; totalVat: number; totalDiscounts: number; grandTotal: number }
  >();

  for (const raw of cart) {
    if (!raw || typeof raw !== 'object') {
      throw new Error('Each cart item must be an object.');
    }
    const id = raw.shoppingCartId
    if (!id || typeof id !== 'string') {
      throw new Error(`Each cart item must have a valid string shoppingCartId.`);
    }

    let unitPrice: number | null = null;

    if (cfg.treatProPriceAs === 'priceProduct') {
      unitPrice =
        raw.priceProduct !== null && raw.priceProduct !== undefined && raw.priceProduct !== ''
          ? parseNumber(raw.priceProduct, `priceProduct (id=${id})`)
          : raw.ProPrice !== null && raw.ProPrice !== undefined && raw.ProPrice !== ''
            ? parseNumber(raw.ProPrice, `ProPrice (id=${id})`)
            : null;
    } else {
      unitPrice =
        raw.ProPrice !== null && raw.ProPrice !== undefined && raw.ProPrice !== ''
          ? parseNumber(raw.ProPrice, `ProPrice (id=${id})`)
          : raw.priceProduct !== null && raw.priceProduct !== undefined && raw.priceProduct !== ''
            ? parseNumber(raw.priceProduct, `priceProduct (id=${id})`)
            : null;
    }

    if (unitPrice === null) {
      throw new Error(`No price found for item id=${id}.`);
    }

    let qty = 1;
    if ('cantProducts' in raw && raw.cantProducts !== undefined) {
      qty = parseNumber(raw.cantProducts, `cantProducts (id=${id})`);
    } else if ('quantity' in raw && raw.quantity !== undefined) {
      qty = parseNumber(raw.quantity, `quantity (id=${id})`);
    }
    if (!Number.isFinite(qty) || qty < 0) {
      throw new Error(`Invalid quantity for item id=${id}: ${String(qty)}`);
    }

    let extrasTotal = 0;

    if (cfg.includeExtras) {
      const products = raw.products;
      if (products && typeof products === 'object') {
        const groups = [products.dataExtra, products.dataOptional];

        for (const arr of groups) {
          if (!arr) continue;
          if (!Array.isArray(arr)) {
            throw new Error(`Extras must be an array for item id=${id}.`);
          }

          for (const ex of arr) {
            if (!ex || typeof ex !== 'object') {
              throw new Error(`Invalid extra object in item id=${id}.`);
            }

            const exPrice = parseOptionalNumber(ex.extraPrice, 0);
            const exQty = parseOptionalNumber(ex.quantity, 1);

            if (exPrice < 0 || exQty < 0) {
              throw new Error(`Invalid extra price/qty in item id=${id}.`);
            }

            extrasTotal += exPrice * exQty;
          }
        }
      }
    }
      
    const lineProductTotal = unitPrice * qty
    const lineSubtotal = lineProductTotal + extrasTotal
    const discountAmount =
      raw.products.discount !== null && raw.products.discount !== undefined
        ? parseOptionalNumber(raw.products.discount, 0)
        : 0;

    if (discountAmount < 0) throw new Error(`Invalid discount on item id=${id}.`);

    let vatAmount = 0;

    if (raw.vat !== null && raw.vat !== undefined && raw.vat !== '') {
      const vatPercent = parseNumber(raw.vat, `vat (id=${id})`);
      if (vatPercent < 0) throw new Error(`Invalid VAT percent on item id=${id}.`);

      vatAmount = (lineSubtotal) * (vatPercent / 100);
    }

    // Accumulate raw totals
    subtotalAcc += lineSubtotal;
    totalExtrasAcc += extrasTotal;
    totalVatAcc += vatAmount;
    totalDiscountsAcc += discountAmount;

    const lineDetail: LineDetail = {
      id,
      unitPrice: round(unitPrice),
      quantity: round(qty),
      extrasTotal: round(extrasTotal),
      lineSubtotal: round(lineSubtotal),
      vatAmount: round(vatAmount),
      discountAmount: round(discountAmount),
    };

    lines.push(lineDetail);

    // Per-store
    const storeId = raw.idStore || 'default'

    const prev =
      storeMap.get(storeId)
      ?? {
        subtotal: 0,
        totalExtras: 0,
        totalVat: 0,
        totalDiscounts: 0,
        grandTotal: 0
      }

    const newSubtotal = prev.subtotal + lineSubtotal;
    const newTotalExtras = prev.totalExtras + extrasTotal;
    const newTotalVat = prev.totalVat + vatAmount;
    const newTotalDiscounts = prev.totalDiscounts + discountAmount;
    const newGrand = newSubtotal + newTotalVat - newTotalDiscounts;

    storeMap.set(storeId, {
      subtotal: newSubtotal,
      totalExtras: newTotalExtras,
      totalVat: newTotalVat,
      totalDiscounts: newTotalDiscounts,
      grandTotal: newGrand,
    });
  }

  const grandTotalRaw = subtotalAcc + totalVatAcc - totalDiscountsAcc;

  /** Validate global discount */
  const globalPercent = parseOptionalNumber(cfg.globalDiscountPercent ?? 0, 0);
  if (globalPercent && (globalPercent < 0 || globalPercent > 100)) {
    throw new Error(`globalDiscountPercent must be between 0 and 100.`);
  }

  /** Calculate global discount value */
  const globalDiscountValue = (grandTotalRaw * globalPercent) / 100;

  /** Total payable after global discount */
  const grandTotalAfterGlobalDiscount = round(grandTotalRaw - globalDiscountValue);

  return {
    subtotal: round(subtotalAcc),
    totalExtras: round(totalExtrasAcc),
    totalVat: round(totalVatAcc),
    totalDiscounts: round(totalDiscountsAcc),
    grandTotal: round(grandTotalRaw),
    globalDiscountValue: round(globalDiscountValue),
    globalDiscountPercent: round(globalPercent),
    grandTotalAfterGlobalDiscount,
    breakdownByStore: Object.fromEntries(
      Array.from(storeMap.entries()).map(([k, v]) => [
        k,
        {
          subtotal: round(v.subtotal),
          totalExtras: round(v.totalExtras),
          totalVat: round(v.totalVat),
          totalDiscounts: round(v.totalDiscounts),
          grandTotal: round(v.grandTotal),
        },
      ])
    ),
    lines: lines.map((l) => ({ ...l })),
  };
}
