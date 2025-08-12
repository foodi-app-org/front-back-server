
export enum StateProduct {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = -1
}

export interface IProduct {
  pId?: string
  idStore?: string
  id?: string
  carProId?: string
  sizeId?: string
  colorId?: string
  cId?: string
  dId?: string
  ctId?: string
  fId?: string
  caId?: string
  poPriority?: number
  stock?: number
  manageStock?: boolean
  previousStock?: number
  valueDelivery?: number
  pName?: string
  tgId?: string
  pCode?: string
  ProPrice?: number
  vat?: number
  ProDescuento?: number
  ProUniDisponibles?: number
  ProDescription?: string
  pState?: StateProduct
  sTateLogistic?: number
  ProProtegido?: number
  ProAssurance?: string
  ProStar?: number
  ProImage?: string
  ProWidth?: number
  ProHeight?: number
  free?: number
  ProLength?: string
  ProWeight?: string
  ProQuantity?: number
  ProOutstanding?: number
  ProDelivery?: number
  ProVoltaje?: string
  ProBarCode?: string
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Product Entity
 * Represents a status order type within a store.
 */
export class Product {
  public pId?: string
  public idStore?: string
  public id?: string
  public carProId?: string
  public sizeId?: string
  public colorId?: string
  public cId?: string
  public dId?: string
  public ctId?: string
  public fId?: string
  public caId?: string
  public poPriority?: number
  public stock?: number
  public manageStock?: boolean
  public previousStock?: number
  public valueDelivery?: number
  public pName?: string
  public tgId?: string
  public pCode?: string
  public ProPrice?: number
  public vat?: number
  public ProDescuento?: number
  public ProUniDisponibles?: number
  public ProDescription?: string
  public pState?: StateProduct
  public sTateLogistic?: number
  public ProProtegido?: number
  public ProAssurance?: string
  public ProStar?: number
  public ProImage?: string
  public ProWidth?: number
  public ProHeight?: number
  public free?: number
  public ProLength?: string
  public ProWeight?: string
  public ProQuantity?: number
  public ProOutstanding?: number
  public ProDelivery?: number
  public ProVoltaje?: string
  public ProBarCode?: string
  public createdAt?: Date
  public updatedAt?: Date

  /**
   * Creates a new Product entity.
   * @param props - Object containing the product properties.
   */
  constructor(props: IProduct) {
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
 * Paginated response for Product
 */
export class ProductPagination {
  public success: boolean
  public message: string
  public data: Product[]
  public pagination: PaginationMeta

  constructor(
    data: Product[],
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