// File: models/stockHistory.model.ts
import { connect } from '@shared/infrastructure/db'
import { Model, DataTypes } from 'sequelize'

const sequelize = connect()
/**
 * Sequelize model sample for StockHistory
 */
export const STOCK_HISTORY_MODEL = 'stock_history'

export class SequelizeStockHistory extends Model {
  declare id: string
  declare pId: string
  declare delta: number
  declare type: string
  declare meta: string
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

export const columnsStockHistory = {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  pId: {
    type: DataTypes.STRING(32),
    allowNull: false
  },
  delta: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(32),
    allowNull: false
  },
  meta: {
    type: DataTypes.TEXT,
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


SequelizeStockHistory.init(
  columnsStockHistory,
  {
    sequelize,
    modelName: STOCK_HISTORY_MODEL,
    freezeTableName: true,
    timestamps: false
  }
)

export default SequelizeStockHistory