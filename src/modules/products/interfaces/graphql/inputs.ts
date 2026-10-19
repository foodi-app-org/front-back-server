import { IProduct } from "@modules/products/domain"

export enum StateShoppingCart {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = -1
}

export interface CreateStatusTypeOrderInput {
    shoppingCartId?: string
    id: string
    idUser?: string
    priceProduct: number
    pId: string
    idStore?: string
    shoppingCartRefCode: string
    discountCartProduct?: string
    comments?: string
    refCodePid?: string
    cantProducts?: number
    sState: StateShoppingCart
    createdAt: Date
    updatedAt: Date
}

export interface CreateMultipleProducts extends IProduct {
    createdAt: Date
    updatedAt: Date
}
