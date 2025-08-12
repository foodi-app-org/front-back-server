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
