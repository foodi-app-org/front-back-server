import { UpdateProductOptionalAndSubOptionalInput } from "../../../product_optional_extra/application/use-cases/bulk-insert-product-optional-and-sub-optional-extra.usecase"

export enum StateShoppingCart {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = -1
}

/**
 * DTO for creating a Shopping Cart order
 */
export interface CreateStatusTypeOrderInput {
  shoppingCartId?: string
  id?: string
  idUser?: string
  priceProduct: number
  pId: string
  idStore?: string
  shoppingCartRefCode: string
  discountCartProduct?: string
  comments?: string
  refCodePid?: string
  cantProducts?: number
  sState?: StateShoppingCart // default in service layer
}

/**
 * @typedef {Object} SubItem
 * @property {string} _id - Unique identifier of the sub-item
 */
interface SubItem {
  _id: string
}

/**
 * @typedef {Object} IdSubArray
 * @property {SubItem[]} setID - Array of sub-items
 */
interface IdSubArray {
  setID: SubItem[]
}

interface ExtraItem {
  pId: string,
  exPid: string,
  exState: number | null,
  extraName: string,
  extraPrice: number,
  state: null,
  createdAt: Date,
  updatedAt: Date,
  quantity: number,
  newExtraPrice: number
}

/**
 * @typedef {Object} ShoppingCartItem
 * @property {string} pId - Product UUID
 * @property {string} shoppingCartRefCode - Reference code for shopping cart
 * @property {number} priceProduct - Price per product
 * @property {number} cantProducts - Quantity of products
 * @property {string} idUser - User UUID
 * @property {string} idStore - Store UUID
 * @property {string} [comments] - Optional comments for the item
 */
interface ShoppingCartItem {
  pId: string
  shoppingCartRefCode: string
  priceProduct: number
  cantProducts: number
  idUser: string
  refCodePid: string
  idStore: string
  comments?: string
  dataExtra?: ExtraItem[]
  dataOptional: UpdateProductOptionalAndSubOptionalInput[]
}

/**
 * @typedef {Object} RegisterSalesStoreInput
 * @property {ShoppingCartItem[]} input - List of shopping cart items
 * @property {string} id - Sale UUID
 * @property {string} tableId - Table UUID
 * @property {number} discount - Discount amount (integer)
 * @property {string} idStore - Store UUID
 * @property {string} pCodeRef - Promotion code reference
 * @property {number} change - Change amount
 * @property {number} payMethodPState - Payment method state
 * @property {number} pickUp - Pick-up status (0 or 1)
 * @property {number} totalProductsPrice - Total price of products
 * @property {number} valueDelivery - Delivery cost
 * @property {IdSubArray} idSubArray - Object containing sub-items
 */
export interface RegisterSalesStoreInput {
  input: ShoppingCartItem[]
  id: string
  tableId: string
  shoppingCartRefCode: string
  discount: number
  tip: number
  idStore: string
  pCodeRef: string
  change: number
  payMethodPState: number
  pickUp: number
  totalProductsPrice: number
  valueDelivery: number
  idSubArray: IdSubArray
}

