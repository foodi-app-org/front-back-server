import {
  DataTypes,
  Model,
  Optional
} from 'sequelize'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'

export const PAYMENT_METHOD_MODEL = 'payment_methods'

const sequelize = connect()

export enum PaymentMethodType {
  STATIC = 'static',
  DYNAMIC = 'dynamic'
}
export enum PaymentMethodState {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted'
}

/**
 * Interface for Module attributes
 */
export interface IPaymentMethodAttributes {
  payId: string
  name: string
  icon: string
  type: PaymentMethodType
  paymentPriority: number
  state: PaymentMethodState
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Fields allowed during Module creation
 */
export type IPaymentMethodCreationAttributes = Optional<
  IPaymentMethodAttributes,
  'payId' | 'createdAt' | 'updatedAt'
>

/**
 * Sequelize PaymentMethod Model
 */
export class SequelizePaymentMethod
  extends Model<IPaymentMethodAttributes, IPaymentMethodCreationAttributes>
  implements IPaymentMethodAttributes {
  declare payId: string
  declare name: string
  declare icon: string
  declare paymentPriority: number
  declare type: PaymentMethodType
  declare state: PaymentMethodState
  declare createdAt?: Date
  declare updatedAt?: Date
}

export const PaymentMethodColumns = {
  payId: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('static', 'dynamic'),
    allowNull: false
  },
  paymentPriority: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  state: {
    type: DataTypes.ENUM('active', 'inactive', 'deleted'),
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

SequelizePaymentMethod.init(PaymentMethodColumns, {
  sequelize,
  modelName: PAYMENT_METHOD_MODEL,
  freezeTableName: true,
  timestamps: false // manejamos manualmente createdAt y updatedAt
})

export default SequelizePaymentMethod
