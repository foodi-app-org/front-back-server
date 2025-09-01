/**
 * ProductCategory Entity
 * Represents a product category within a store, created by a user.
 */
export interface ProductCategoryProps {
  id?: string
  idStore?: string
  carProId?: string
  ProImage?: string
  pName: string
  ProDescription?: string
  pState: number
  createdAt?: Date
  updatedAt?: Date
}

export class ProductCategory {
  public readonly id?: string
  public readonly idStore?: string
  public readonly carProId?: string
  public readonly ProImage?: string
  public readonly pName: string
  public readonly ProDescription?: string
  public readonly pState: number
  public readonly createdAt: Date
  public readonly updatedAt: Date

  /**
   * Create new ProductCategory
   * @param props - Category properties
   * @throws Error if required fields are missing or invalid
   */
  constructor(props: ProductCategoryProps) {
    this.id = props.id
    this.idStore = props.idStore
    this.carProId = props.carProId
    this.ProImage = props.ProImage
    this.pName = props.pName
    this.ProDescription = props.ProDescription
    this.pState = props.pState
    this.createdAt = props.createdAt ?? new Date()
    this.updatedAt = props.updatedAt ?? new Date()
  }
}
