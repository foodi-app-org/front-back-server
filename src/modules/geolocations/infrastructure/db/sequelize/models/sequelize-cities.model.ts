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


export const CITIES_MODEL = 'cities'

export enum StateCitiesEnum {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = -1
}

/**
 * Interface that defines the attributes of the Cities model, including all fields and their types.
 */
export interface IStatusCitiesAttributes {
  ctId: string
  dId: string
  cName: string
  code_ctId: string
  default?: boolean
  cState: StateCitiesEnum
  createdAt: Date
  updatedAt: Date
}

/**
 * Fields allowed during creation
 */
export type IStatusCitiesCreationAttributes =
  Optional<IStatusCitiesAttributes, 'createdAt' | 'updatedAt'>

/**
 * Sequelize Model definition
 */
export class SequelizeCitiesModel
  extends Model<IStatusCitiesAttributes, IStatusCitiesCreationAttributes>
  implements IStatusCitiesAttributes {
  declare ctId: string
  declare dId: string
  declare cName: string
  declare cCalCod?: string
  declare code_ctId: string
  declare cState: StateCitiesEnum
  declare default?: boolean
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

export const columnsCities = {
  ctId: {
    type: STRING,
    primaryKey: true,
    defaultValue: UUIDV4
  },
  dId: {
    type: STRING,
    allowNull: false,
    // describe the relationship with the department table
  },
  cName: {
    type: STRING,
    allowNull: false
  },
  cCalCod: {
    type: STRING,
    allowNull: true
  },
  code_ctId: {
    type: STRING
  },
  cState: {
    type: INTEGER,
    allowNull: false,
    defaultValue: StateCitiesEnum.ACTIVE
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

SequelizeCitiesModel.init(
  columnsCities,
  {
    sequelize,
    modelName: CITIES_MODEL,
    freezeTableName: true,
    timestamps: true
  }
)

export default SequelizeCitiesModel
