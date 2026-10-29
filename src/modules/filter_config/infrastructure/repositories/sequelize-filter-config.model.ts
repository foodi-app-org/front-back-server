import { DataTypes, Model, Optional } from 'sequelize'
import connect from '../../../../shared/infrastructure/db/sequelize/sequelize.connect'

const sequelize = connect()
sequelize.sync()

export const FILTER_CONFIG_MODEL = 'filter_configs'

export interface IFilterConfigAttributes {
  id?: string
  idStore?: string | null
  filterTabs: object
  active?: boolean
  priority?: number
  createdAt?: Date
  updatedAt?: Date
}

export type IFilterConfigCreationAttributes = Optional<
  IFilterConfigAttributes,
  'id' | 'idStore' | 'active' | 'priority' | 'createdAt' | 'updatedAt'
>

export class SequelizeFilterConfigModel
  extends Model<IFilterConfigAttributes, IFilterConfigCreationAttributes>
  implements IFilterConfigAttributes {
  declare id: string
  declare idStore: string | null
  declare filterTabs: object
  declare active: boolean
  declare priority: number
  declare createdAt?: Date
  declare updatedAt?: Date
}

export const FilterConfigColumns = {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4
  },
  idStore: {
    type: DataTypes.STRING(36),
    allowNull: true,
    defaultValue: null
  },
  filterTabs: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100
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

SequelizeFilterConfigModel.init(FilterConfigColumns, {
  sequelize,
  modelName: FILTER_CONFIG_MODEL,
  freezeTableName: true,
  timestamps: false
})

export default SequelizeFilterConfigModel
