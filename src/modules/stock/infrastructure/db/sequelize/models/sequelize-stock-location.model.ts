// File: models/stockLocation.model.ts
import { connect } from '@shared/infrastructure/db'
import { Model, DataTypes } from 'sequelize'

const sequelize = connect()
/**
 * Sequelize model sample for StockLocation
 */
export const STOCK_LOCATION_MODEL = 'stock_locations'

export class SequelizeStockLocation extends Model {
  declare id: string
  declare idStore: string
  declare name: string
  declare description: string | null
  declare type: string
  declare priority?: number
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

export const columnsStockLocation = {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  idStore: {
    type: DataTypes.STRING(32),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(32),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.STRING(32),
    allowNull: false
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false
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


SequelizeStockLocation.init(
  columnsStockLocation,
  {
    sequelize,
    modelName: STOCK_LOCATION_MODEL,
    freezeTableName: true,
    timestamps: false
  }
)

export default SequelizeStockLocation