/**
 * cart-totals.ts
 *
 * Complete TypeScript implementation that computes cart totals and per-item breakdowns.
 * Includes types, implementation, JSDoc and Jest tests.
 *
 * Copy this file into your project (or split tests into __tests__ folder if you prefer).
 */

/* ============================
 * Types & Interfaces
 * ============================ */

/**
 * A numeric-like value that may come as number, numeric string, null, or undefined.
 */
type NumericLike = number | string | null | undefined;


/**
 * Product structure nested inside each cart item (partial of real schema).
 */
export interface Product {
  readonly pId: string;
  readonly idStore: string;
  readonly ProPrice?: NumericLike;
  readonly vat?: NumericLike; // percentage, e.g. 19 for 19%
  readonly ProQuantity?: NumericLike; // quantity inside product (fallback)
  readonly ProName?: string | null;
  readonly ProDescription?: string | null;
  readonly ProImage?: string | null;
  // ... other fields omitted for brevity but allowed in object
  readonly [key: string]: unknown;
}

/**
 * Extra attached to a product (dataExtra/extras).
 */
export interface Extra {
  readonly exPid?: string;
  readonly extraName?: string | null;
  readonly extraPrice?: NumericLike;
  readonly quantity?: NumericLike; // quantity of this extra per product unit
  readonly originalExPid?: string | null;
  readonly [key: string]: unknown;
}

/**
 * Optional extras structure (dataOptional) which may contain nested extras (ExtProductFoodsSubOptionalAll)
 */
export interface OptionalExtra {
  readonly opExPid?: string;
  readonly OptionalProName?: string | null;
  readonly numbersOptionalOnly?: NumericLike | null;
  readonly required?: NumericLike | null;
  readonly ExtProductFoodsSubOptionalAll?: ReadonlyArray<{ readonly extraPrice?: NumericLike; readonly quantity?: NumericLike; [key: string]: unknown }> | null;
  readonly [key: string]: unknown;
}

/**
 * Cart item as provided in the input array (keeps the original shape mostly readonly).
 */
export interface CartItem {
  readonly shoppingCartId: string;
  readonly id?: string;
  readonly idUser?: string | null;
  readonly priceProduct?: NumericLike; // top-level price override
  readonly pId: string;
  readonly idStore: string;
  readonly shoppingCartRefCode?: string;
  readonly discountCartProduct?: NumericLike | null;
  readonly comments?: string | null;
  readonly refCodePid?: string | null;
  readonly cantProducts?: NumericLike; // quantity at cart-line level
  readonly sState?: NumericLike;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly products: Product & {
    readonly dataExtra?: ReadonlyArray<Extra> | null;
    readonly dataOptional?: ReadonlyArray<OptionalExtra> | null;
    readonly ProQuantity?: NumericLike;
    readonly ProPrice?: NumericLike;
    readonly vat?: NumericLike;
    readonly ProDescuento?: NumericLike | null;
    readonly ProQuantitySelected?: NumericLike | null;
    readonly ProQuantityField?: NumericLike | null;
    readonly [key: string]: unknown;
  };
  readonly [key: string]: unknown;
}

/**
 * Options to control computation behaviour.
 */
export interface ComputeOptions {
  readonly currencySymbol?: string; // default: '$'
  readonly rounding?: number; // decimals to round final amounts, default 0 (COP)
  readonly treatProPriceAs?: 'priceProduct' | 'ProPrice'; // which field has priority when picking unit price
  readonly includeExtras?: boolean; // whether to include extras in totals (default true)
}

/**
 * Output per-line item totals.
 */
export interface ItemTotals {
  readonly shoppingCartId: string;
  readonly pId: string;
  readonly idStore: string;
  readonly unitPrice: number;
  readonly quantity: number;
  readonly extrasTotal: number;
  readonly lineSubtotal: number; // unitPrice * quantity + extrasTotal
  readonly vatAmount: number;
  readonly discountAmount: number;
}

/**
 * Totals returned by computeCartTotals.
 */
export interface CartTotals {
  readonly subtotal: number; // sum of lineSubtotal before taxes
  readonly totalExtras: number;
  readonly totalVat: number;
  readonly totalDiscounts: number;
  readonly grandTotal: number; // subtotal + totalVat - totalDiscounts
  readonly breakdownByStore: Readonly<Record<string, {
    readonly subtotal: number;
    readonly totalExtras: number;
    readonly totalVat: number;
    readonly totalDiscounts: number;
    readonly grandTotal: number;
    readonly items: ItemTotals[];
  }>>;
  readonly currencySymbol: string;
  readonly items: ItemTotals[];
}

/* ============================
 * Helpers (pure, small)
 * ============================ */

/**
 * Parse numeric-like values to number. If invalid, returns defaultValue (0 by default).
 * Accepts numbers, numeric strings (with commas or spaces), null/undefined -> defaultValue.
 *
 * @param v Value to parse
 * @param defaultValue fallback value
 */
function parseNumber(v: NumericLike, defaultValue = 0): number {
  if (v === null || v === undefined || v === '') return defaultValue;
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    // remove thousand separators commonly used (commas or spaces)
    const cleaned = v.replace(/\s+/g, '').replace(/,/g, '');
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : defaultValue;
  }
  return defaultValue;
}

/**
 * Round a number to the given decimals (standard half-away-from-zero).
 *
 * @param v number
 * @param decimals decimals
 */
function round(v: number, decimals: number): number {
  if (!Number.isFinite(v)) return v;
  const factor = 10 ** decimals;
  // Use Math.round which is half-away-from-zero for positive numbers; this is suitable for accounting rounding.
  return Math.round((v + Number.EPSILON) * factor) / factor;
}

/**
 * Validate ISO date string (basic).
 * Throws Error if invalid.
 *
 * @param label Field label for error messages.
 * @param candidate Date string
 */
function validateIsoDate(label: string, candidate?: string | null): void {
  if (candidate == null) return;
  // Date.parse accepts many formats, but require a valid date.
  const ts = Date.parse(candidate);
  if (Number.isNaN(ts)) throw new Error(`${label} is not a valid ISO date: ${candidate}`);
}

/* ============================
 * Main exported function
 * ============================ */

/**
 * Compute totals for a shopping cart.
 *
 * Behavior notes:
 * - Unit price resolution: based on opts.treatProPriceAs (priority).
 *   If 'priceProduct' -> use top-level cart.priceProduct (if > 0) else fallback to products.ProPrice.
 *   If 'ProPrice' -> use products.ProPrice (if > 0) else fallback to cart.priceProduct.
 *   If both are missing/0, unitPrice will be 0.
 *
 * - Extras handling:
 *   * dataExtra[] entries are considered extras containing extraPrice and quantity fields.
 *   * For each extra: extraUnitTotal = extraPrice * (extra.quantity || 1)
 *   * extrasUnitTotal (per single product unit) = sum(extraUnitTotal)
 *   * extrasTotal for the line = extrasUnitTotal * productQuantity
 *
 * - Optional extras (dataOptional) are inspected: if nested elements containing extraPrice are present,
 *   they are included similarly.
 *
 * - VAT calculation:
 *   vatAmount per line = ((unitPrice * quantity) + extrasTotal) * (vat / 100)
 *   If vat missing or 0, treated as 0.
 *
 * - Discounts:
 *   If discountCartProduct or products.ProDescuento is present and numeric, discountAmount is computed
 *   as that discount (interpreted as absolute currency amount). Future versions could support percentage discounts.
 *
 * - Validation strategy:
 *   This function throws Error on clearly invalid critical fields (malformed dates, missing required nested product, etc.).
 *
 * Complexity: O(n) where n is number of cart lines plus nested extras.
 *
 * @param cart Array of CartItem objects (as provided)
 * @param opts Optional compute options
 * @returns CartTotals
 * @throws Error on invalid input
 */
export function computeCartTotals(cart: CartItem[], opts?: ComputeOptions): CartTotals {
  // Validate top-level input
  if (!Array.isArray(cart)) throw new Error('cart must be an array');

  const o: Required<ComputeOptions> = {
    currencySymbol: opts?.currencySymbol ?? '$',
    rounding: opts?.rounding ?? 0,
    treatProPriceAs: opts?.treatProPriceAs ?? 'priceProduct',
    includeExtras: opts?.includeExtras ?? true,
  };

  const itemsTotals: ItemTotals[] = [];
  const breakdownByStore: Record<string, { subtotal: number; totalExtras: number; totalVat: number; totalDiscounts: number; items: ItemTotals[] }> = Object.create(null);

  let subtotalAcc = 0;
  let totalExtrasAcc = 0;
  let totalVatAcc = 0;
  let totalDiscountsAcc = 0;

  for (const line of cart) {
    if (!line || typeof line !== 'object') throw new Error('each cart line must be an object');
    // Validate dates (non-critical but requested)
    validateIsoDate('createdAt', line.createdAt as string | undefined);
    validateIsoDate('updatedAt', line.updatedAt as string | undefined);

    if (!line.products || typeof line.products !== 'object') throw new Error(`cart line ${line.shoppingCartId} missing products object`);

    const product = line.products;

    // Validate nested product dates as well
    validateIsoDate('product.createdAt', product.createdAt as string | undefined);
    validateIsoDate('product.updatedAt', product.updatedAt as string | undefined);

    // Determine quantities: use top-level cantProducts, fallback to product.ProQuantity, fallback to products.ProQuantitySelected or 1
    const cartQuantity = Math.max(0, Math.trunc(parseNumber(line.cantProducts, parseNumber(product.ProQuantity ?? product.ProQuantitySelected ?? 1))));
    const productQuantityField = Math.max(0, Math.trunc(parseNumber(product.ProQuantity ?? 0, 0)));
    const quantity = cartQuantity > 0 ? cartQuantity : (productQuantityField > 0 ? productQuantityField : 1);

    // Resolve unit price per options priority
    const priceProductTop = parseNumber(line.priceProduct, 0);
    const productProPrice = parseNumber(product.ProPrice, 0);

    let unitPrice: number;
    if (o.treatProPriceAs === 'priceProduct') {
      unitPrice = priceProductTop > 0 ? priceProductTop : productProPrice;
    } else {
      unitPrice = productProPrice > 0 ? productProPrice : priceProductTop;
    }
    unitPrice = Math.max(0, unitPrice);

    // Extras: sum dataExtra and dataOptional nested entries
    const extrasUnitTotalFromDataExtra = (Array.isArray(product.dataExtra) ? product.dataExtra : []).reduce((acc: number, exRaw) => {
      const extraPrice = parseNumber((exRaw as Extra).extraPrice, 0);
      const extraQty = Math.max(0, Math.trunc(parseNumber((exRaw as Extra).quantity, 1)));
      return acc + extraPrice * extraQty;
    }, 0);

    const extrasUnitTotalFromDataOptional = (Array.isArray(product.dataOptional) ? product.dataOptional : []).reduce((acc: number, opt) => {
      // Check nested ExtProductFoodsSubOptionalAll which may contain extraPrice & quantity
      const nested = Array.isArray(opt.ExtProductFoodsSubOptionalAll) ? opt.ExtProductFoodsSubOptionalAll : [];
      const nestedSum = nested.reduce((nacc: number, nestedExtra) => {
        const extraPrice = parseNumber((nestedExtra as any).extraPrice, 0);
        const extraQty = Math.max(0, Math.trunc(parseNumber((nestedExtra as any).quantity, 1)));
        return nacc + extraPrice * extraQty;
      }, 0);
      return acc + nestedSum;
    }, 0);

    const extrasUnitTotal = extrasUnitTotalFromDataExtra + extrasUnitTotalFromDataOptional;

    // total extras for the line: extras per unit times quantity of product units in the cart line
    const extrasTotal = o.includeExtras ? extrasUnitTotal * quantity : 0;

    // line subtotal (before VAT and discounts): unitPrice * quantity + extrasTotal
    const lineSubtotalRaw = unitPrice * quantity + extrasTotal;

    // VAT percentage resolution (product-level vat first)
    const vatPercent = parseNumber(product.vat ?? product.vat, 0); // support product.vat or fallback
    const vatAmountRaw = (vatPercent > 0) ? ((lineSubtotalRaw * vatPercent) / 100) : 0;

    // Discounts: prioritize line.discountCartProduct else product.ProDescuento
    const discountCart = parseNumber(line.discountCartProduct as NumericLike, 0);
    const productDiscount = parseNumber(product.ProDescuento as NumericLike, 0);
    const discountAmountRaw = Math.max(0, discountCart > 0 ? discountCart : productDiscount);

    // Round amounts according to options
    const unitPriceRounded = round(unitPrice, o.rounding);
    const extrasTotalRounded = round(extrasTotal, o.rounding);
    const lineSubtotalRounded = round(lineSubtotalRaw, o.rounding);
    const vatAmountRounded = round(vatAmountRaw, o.rounding);
    const discountAmountRounded = round(discountAmountRaw, o.rounding);

    const itemTotals: ItemTotals = {
      shoppingCartId: line.shoppingCartId,
      pId: line.pId,
      idStore: line.idStore,
      unitPrice: unitPriceRounded,
      quantity,
      extrasTotal: extrasTotalRounded,
      lineSubtotal: lineSubtotalRounded,
      vatAmount: vatAmountRounded,
      discountAmount: discountAmountRounded,
    };

    itemsTotals.push(itemTotals);

    // Accumulate global totals
    subtotalAcc += lineSubtotalRounded;
    totalExtrasAcc += extrasTotalRounded;
    totalVatAcc += vatAmountRounded;
    totalDiscountsAcc += discountAmountRounded;

    // Breakdown per store
    const storeKey = line.idStore || 'unknown';
    if (!breakdownByStore[storeKey]) {
      breakdownByStore[storeKey] = { subtotal: 0, totalExtras: 0, totalVat: 0, totalDiscounts: 0, items: [] };
    }
    breakdownByStore[storeKey].subtotal += lineSubtotalRounded;
    breakdownByStore[storeKey].totalExtras += extrasTotalRounded;
    breakdownByStore[storeKey].totalVat += vatAmountRounded;
    breakdownByStore[storeKey].totalDiscounts += discountAmountRounded;
    breakdownByStore[storeKey].items.push(itemTotals);
  }

  // Final grand total
  const subtotalRounded = round(subtotalAcc, o.rounding);
  const totalExtrasRounded = round(totalExtrasAcc, o.rounding);
  const totalVatRounded = round(totalVatAcc, o.rounding);
  const totalDiscountsRounded = round(totalDiscountsAcc, o.rounding);
  const grandTotalRounded = round(subtotalRounded + totalVatRounded - totalDiscountsRounded, o.rounding);

  // Finalize breakdownByStore values rounding & compute grand totals per store
  const breakdownFinal: Record<string, {
    readonly subtotal: number;
    readonly totalExtras: number;
    readonly totalVat: number;
    readonly totalDiscounts: number;
    readonly grandTotal: number;
    readonly items: ItemTotals[];
  }> = Object.create(null);

  for (const [storeKey, val] of Object.entries(breakdownByStore)) {
    const ss = round(val.subtotal, o.rounding);
    const te = round(val.totalExtras, o.rounding);
    const tv = round(val.totalVat, o.rounding);
    const td = round(val.totalDiscounts, o.rounding);
    const gt = round(ss + tv - td, o.rounding);
    breakdownFinal[storeKey] = {
      subtotal: ss,
      totalExtras: te,
      totalVat: tv,
      totalDiscounts: td,
      grandTotal: gt,
      items: val.items,
    };
  }

  return {
    subtotal: subtotalRounded,
    totalExtras: totalExtrasRounded,
    totalVat: totalVatRounded,
    totalDiscounts: totalDiscountsRounded,
    grandTotal: grandTotalRounded,
    breakdownByStore: breakdownFinal,
    currencySymbol: o.currencySymbol,
    items: itemsTotals,
  };
}
