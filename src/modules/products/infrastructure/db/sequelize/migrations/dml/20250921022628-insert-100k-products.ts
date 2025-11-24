import { QueryInterface } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'

import { PRODUCT_MODEL } from '../../models/sequelize-product.model'

const TOTAL_PRODUCTS = 100
const CHUNK_SIZE = 5000

/**
 * Generate fake products for seeding
 */
const generateProducts = (count: number) => {
  const products: any[] = []
  for (let i = 0; i < count; i++) {
    const id = uuidv4()
    products.push({
      pId: id,
      idStore: uuidv4(),
      id: uuidv4(),
      carProId: null,
      sizeId: null,
      colorId: null,
      cId: null,
      dId: null,
      ctId: null,
      fId: null,
      caId: null,
      poPriority: 1,
      stock: Math.floor(Math.random() * 100),
      manageStock: true,
      previousStock: 0,
      valueDelivery: 0,
      pName: `Product ${id.substring(0, 8)}`,
      tgId: null,
      pCode: `CODE-${id.substring(0, 6)}`,
      ProPrice: (Math.random() * 100).toFixed(2),
      vat: 19.0,
      ProDescuento: 0,
      ProUniDisponibles: 10,
      ProDescription: 'Seeded product for testing',
      pState: 1,
      sTateLogistic: 1,
      ProProtegido: 0,
      ProAssurance: null,
      ProStar: 0,
      ProImage: null,
      ProWidth: 10,
      ProHeight: 10,
      free: 0,
      ProLength: '10',
      ProWeight: '1',
      ProQuantity: 1,
      ProOutstanding: 0,
      ProDelivery: 1,
      ProVoltaje: null,
      ProBarCode: `BAR-${id.substring(0, 10)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }
  return products
}

/**
 * Insert 100k products in chunks
 */
export const up = async (queryInterface, schemaName) => {
  for (let inserted = 0; inserted < TOTAL_PRODUCTS; inserted += CHUNK_SIZE) {
    const products = generateProducts(
      Math.min(CHUNK_SIZE, TOTAL_PRODUCTS - inserted)
    )
    await queryInterface.bulkInsert(
      { tableName: PRODUCT_MODEL, schema: schemaName },
      products
    )
    console.log(`Inserted ${inserted + products.length}/${TOTAL_PRODUCTS}`)
  }
}


/**
 * Remove seeded products
 */
export const down = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  await queryInterface.bulkDelete(
    { tableName: PRODUCT_MODEL, schema: schemaName },
    {
      ProDescription: 'Seeded product for testing'
    }
  )
}
