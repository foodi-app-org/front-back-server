
/**
 * ShoppingCart Entity
 * Represents a status order type within a store, created by a user.
 */

export enum StateShoppingCart {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = -1
}

export interface IShoppingCart {
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
  sState: StateShoppingCart
  createdAt: Date
  updatedAt: Date
}

/**
 * ShoppingCart Entity
 * Represents a status order type within a store.
 */
export class ShoppingCart {
  public stPId?: string
  public shoppingCartId?: string
  public id?: string
  public idUser?: string
  public priceProduct: number
  public pId: string
  public idStore?: string
  public shoppingCartRefCode: string
  public discountCartProduct?: string
  public comments?: string
  public refCodePid?: string
  public cantProducts?: number
  public pCodeRef?: string // Reference code for the sale
  public sState: StateShoppingCart = StateShoppingCart.ACTIVE
  // Timestamps
  public createdAt: Date = new Date()
  public updatedAt: Date = new Date()

  /**
   * Creates a new ShoppingCart entity.
   * @param props - Object containing the status order type properties.
   */
  constructor(props: IShoppingCart) {
    this.pId = props.pId
    this.id = props.id
    this.idUser = props.idUser
    this.priceProduct = props.priceProduct
    this.shoppingCartRefCode = props.shoppingCartRefCode
    Object.assign(this, props)
  }
}



export class PaginationMeta {
  public totalRecords: number
  public totalPages: number
  public currentPage: number

  constructor(totalRecords: number, pageSize: number, currentPage: number) {
    this.totalRecords = totalRecords
    this.totalPages = Math.ceil(totalRecords / pageSize)
    this.currentPage = currentPage
  }
}

/**
 * Paginated response for ShoppingCart
 */
export class ShoppingCartPagination {
  public success: boolean
  public message: string
  public data: ShoppingCart[]
  public pagination: PaginationMeta

  constructor(
    data: ShoppingCart[],
    totalRecords: number,
    pageSize: number,
    currentPage: number,
    message = 'Data fetched successfully'
  ) {
    this.success = true
    this.message = message
    this.data = data
    this.pagination = new PaginationMeta(totalRecords, pageSize, currentPage)
  }
}