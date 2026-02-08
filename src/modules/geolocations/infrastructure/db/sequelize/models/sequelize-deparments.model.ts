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


export const DEPARTMENT_MODEL = 'departments'

export enum StateDepartmentsEnum {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = -1
}

/**
 * Interface that defines the attributes of the departments model, including all fields and their types.
 */
export interface IStatusDepartmentsAttributes {
  dId: string
  dName: string
  cId: string
  dCalCod?: string
  default?: boolean
  code_dId: string
  dState: StateDepartmentsEnum
  createdAt: Date
  updatedAt: Date
}

/**
 * Fields allowed during creation
 */
export type IStatusDepartmentsCreationAttributes =
  Optional<IStatusDepartmentsAttributes, 'createdAt' | 'updatedAt'>

/**
 * Sequelize Model definition
 */
export class SequelizeDepartmentsModel
  extends Model<IStatusDepartmentsAttributes, IStatusDepartmentsCreationAttributes>
  implements IStatusDepartmentsAttributes 
{
  declare dId: string
  declare cId: string
  declare dName: string
  declare dCalCod?: string
  declare code_dId: string
  declare dState: StateDepartmentsEnum
  declare default?: boolean
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

export const columnsDepartments = {
  dId: {
    type: STRING,
    primaryKey: true,
    defaultValue: UUIDV4
  },
  cId: {
    type: STRING,
    allowNull: false,
    // describe the relationship with the countries table
  },
  dName: {
    type: STRING,
    allowNull: false
  },
  dCalCod: {
    type: STRING,
    allowNull: true
  },
  code_dId: {
    type: STRING
  },
  dState: {
    type: INTEGER,
    allowNull: false,
    defaultValue: StateDepartmentsEnum.ACTIVE
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

SequelizeDepartmentsModel.init(
  columnsDepartments,
  {
    sequelize,
    modelName: DEPARTMENT_MODEL,
    freezeTableName: true,
    timestamps: true
  }
)

export default SequelizeDepartmentsModel
