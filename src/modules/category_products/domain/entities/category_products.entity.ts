/**
 * ProductCategory Entity
 * Represents a product category within a store, created by a user.
 */

export interface ProductCategoryProps {
  carProId?: string
  id?: string
  idStore?: string
  ProImage?: string
  pName?: string
  ProDescription?: string
  pState?: number
  createdAt?: Date
  updatedAt?: Date
}

export class ProductCategory {
  public readonly id?: string
  public pName: string
  public idStore?: string
  public carProId?: string
  public ProImage?: string
  public ProDescription?: string
  public pState: number
  public createdAt: Date
  public updatedAt: Date

  /**
   * Create new ProductCategory
   * @param props - Category properties
   */
  constructor(props: ProductCategoryProps) {
    this.id = props.id
    this.idStore = props.idStore
    this.pName = props.pName ?? ''
    this.ProDescription = props.ProDescription ?? ''
    this.pState = props.pState ?? 1
    this.createdAt = props.createdAt ?? new Date()
    this.updatedAt = props.updatedAt ?? new Date()
  }

}
