import { DataTypes, Sequelize, UniqueConstraintError } from 'sequelize'

/**
 * Prueba de integración del COMPORTAMIENTO del índice único compuesto
 * `(idStore, ProBarCode)` que instala la migración
 * `20261106150000-product-barcode-unique-per-store.ts`.
 *
 * Se ejecuta sobre SQLite en memoria (aislada, repetible, sin tocar ninguna
 * base real). No valida el DDL exacto de Postgres (removeIndex/addIndex por
 * schema), sino la GARANTÍA funcional que ese índice provee, que es lo que
 * importa para la regla de negocio:
 *   - Mismo (idStore, ProBarCode) duplicado -> rechazado.
 *   - Mismo ProBarCode en tiendas distintas -> permitido.
 *   - Varios ProBarCode NULL -> permitidos (no bloqueados por el índice).
 *   - El rechazo es un UniqueConstraintError recuperable.
 */
describe('Índice único (idStore, ProBarCode) — comportamiento', () => {
  let sequelize: Sequelize
  let Product: any

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false })
    Product = sequelize.define(
      'product_models_test',
      {
        pId: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
        idStore: { type: DataTypes.STRING(36), allowNull: true },
        pName: { type: DataTypes.STRING, allowNull: false },
        pState: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
        ProBarCode: { type: DataTypes.STRING(50), allowNull: true }
      },
      {
        freezeTableName: true,
        timestamps: false,
        indexes: [
          {
            name: 'uq_test_idstore_probarcode',
            unique: true,
            fields: ['idStore', 'ProBarCode']
          }
        ]
      }
    )
    await sequelize.sync({ force: true })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  it('permite el MISMO código de barras en tiendas DISTINTAS', async () => {
    await Product.create({ idStore: 'storeA', pName: 'P1', ProBarCode: '7700000000007' })
    await expect(
      Product.create({ idStore: 'storeB', pName: 'P2', ProBarCode: '7700000000007' })
    ).resolves.toBeDefined()
  })

  it('RECHAZA el mismo código duplicado dentro de la MISMA tienda', async () => {
    await Product.create({ idStore: 'storeC', pName: 'P3', ProBarCode: '2111111111118' })
    let error: unknown = null
    try {
      await Product.create({ idStore: 'storeC', pName: 'P3-dup', ProBarCode: '2111111111118' })
    } catch (e) {
      error = e
    }
    expect(error).toBeInstanceOf(UniqueConstraintError)
  })

  it('permite múltiples productos con ProBarCode NULL (índice no los bloquea)', async () => {
    await Product.create({ idStore: 'storeD', pName: 'N1', ProBarCode: null })
    await expect(
      Product.create({ idStore: 'storeD', pName: 'N2', ProBarCode: null })
    ).resolves.toBeDefined()
  })

  it('rechaza duplicado aunque el estado (pState) difiera (índice no distingue estado)', async () => {
    await Product.create({ idStore: 'storeE', pName: 'A', ProBarCode: '2222222222226', pState: 1 })
    let error: unknown = null
    try {
      // Mismo idStore+código pero inactivo: igual colisiona.
      await Product.create({ idStore: 'storeE', pName: 'B', ProBarCode: '2222222222226', pState: 0 })
    } catch (e) {
      error = e
    }
    expect(error).toBeInstanceOf(UniqueConstraintError)
  })
})
