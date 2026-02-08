import {
  DataTypes,
  INTEGER,
  Model,
  Optional,
  STRING,
  UUIDV4,
  BOOLEAN
} from 'sequelize'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'

const sequelize = connect()

export const COUNTRIES_MODEL = 'countries'

export enum StateCountriesEnum {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = -1
}

/**
 * Interface that defines the attributes of the Countries model, including all fields and their types.
 */
export interface IStatusOrderStoreAttributes {
  cId: string
  cName: string
  cCalCod?: string
  default?: boolean
  cState: StateCountriesEnum
  createdAt: Date
  updatedAt: Date
}

/**
 * Fields allowed during creation
 */
export type IStatusOrderStoreCreationAttributes =
  Optional<IStatusOrderStoreAttributes, 'createdAt' | 'updatedAt'>

/**
 * Sequelize Model definition
 */
export class SequelizeCountriesModel
  extends Model<IStatusOrderStoreAttributes, IStatusOrderStoreCreationAttributes>
  implements IStatusOrderStoreAttributes 
{
  declare cId: string
  declare cName: string
  declare cCalCod?: string
  declare cState: StateCountriesEnum
  declare default?: boolean
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

export const columnsCountries = {
  cId: {
    type: STRING,
    primaryKey: true,
    defaultValue: UUIDV4
  },
  cName: {
    type: STRING,
    allowNull: false
  },
  cCalCod: {
    type: STRING,
    allowNull: true
  },
  cState: {
    type: INTEGER,
    allowNull: false,
    defaultValue: StateCountriesEnum.ACTIVE
  },
  default: {
    type: BOOLEAN,
    allowNull: true,
    defaultValue: false
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

SequelizeCountriesModel.init(
  columnsCountries,
  {
    sequelize,
    modelName: COUNTRIES_MODEL,
    freezeTableName: true,
    timestamps: true
  }
)

export default SequelizeCountriesModel
