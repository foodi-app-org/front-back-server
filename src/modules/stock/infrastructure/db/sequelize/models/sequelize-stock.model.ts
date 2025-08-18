import {
  DataTypes,
  ENUM,
  Model,
  Optional,
  STRING,
  UUIDV4
} from 'sequelize'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'

const sequelize = connect()

export const STOCK_MOVEMENT_NAME = 'stock_movements'

/**
 * Enum for movement types
 */
export enum MovementTypes {
  IN = 'IN',
  OUT = 'OUT',
  ADJUSTMENT = 'ADJUSTMENT'
}

/**
 * Interface that defines the attributes stored in DB
 */
export interface IStockMovementAttributes {
  id: string
  idStockMoment: string
  productId: string
  movementType: MovementTypes
  quantity: number
  previousStock: number
  newStock: number
  reference?: string | null
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Fields allowed during creation
 */
export type IStockMovementCreationAttributes = Optional<
  IStockMovementAttributes,
  'id' | 'idStockMoment' | 'reference' | 'createdAt' | 'updatedAt'
>

/**
 * Sequelize Model definition
 */
export class SequelizeStockMovementModel
  extends Model<IStockMovementAttributes, IStockMovementCreationAttributes>
  implements IStockMovementAttributes
{
  declare id: string
  declare idStockMoment: string
  declare productId: string
  declare movementType: MovementTypes
  declare quantity: number
  declare previousStock: number
  declare newStock: number
  declare reference?: string | null
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

/**
 * Column definitions for migration and model
 */
export const columnsStockMovement = {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4
  },
  idStockMoment: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: UUIDV4
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  movementType: {
    type: ENUM(
      MovementTypes.IN,
      MovementTypes.OUT,
      MovementTypes.ADJUSTMENT
    ),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  previousStock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  newStock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  reference: {
    type: STRING,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}

SequelizeStockMovementModel.init(columnsStockMovement, {
  sequelize,
  modelName: STOCK_MOVEMENT_NAME,
  freezeTableName: true,
  timestamps: true
})

export default SequelizeStockMovementModel
