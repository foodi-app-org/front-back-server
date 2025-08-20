import { Transaction } from 'sequelize'

import { ShoppingCart } from '../entities/shopping.entity'

/**
 * Repository contract for StatusTypesOrderTypesRepository operations
 */
export interface ShoppingCartRepository {
  create(data: ShoppingCart, transaction?: Transaction): Promise<ShoppingCart | null>
  findCodeRef(pCodeRef: string): Promise<ShoppingCart | null>
  findById(id: string): Promise<ShoppingCart | null>
  sumPrice(id: string): Promise<number | null>
}
