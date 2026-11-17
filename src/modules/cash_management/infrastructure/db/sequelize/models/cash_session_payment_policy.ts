
import {
  DataTypes,
  Model,
  Optional
} from 'sequelize'

import connect from '@shared/infrastructure/db/sequelize/sequelize.connect'

export const MODEL_SESSION_PAYMENT_POLICY_NAME =
  'cash_session_payment_policy'

export interface ISessionPaymentPolicyAttributes {
  sessionId: string
  idStore: string
  methodIdsJson: string
}

export type ISessionPaymentPolicyCreationAttributes =
  Optional<ISessionPaymentPolicyAttributes, never>

export class SequelizeSessionPaymentPolicyModel
  extends Model<
    ISessionPaymentPolicyAttributes,
    ISessionPaymentPolicyCreationAttributes
  >
  implements ISessionPaymentPolicyAttributes {
  declare sessionId: string
  declare idStore: string
  declare methodIdsJson: string
}

export const SessionPaymentPolicyColumns = {
  sessionId: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    allowNull: false
  },

  idStore: {
    type: DataTypes.STRING(36),
    allowNull: false
  },

  methodIdsJson: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}

SequelizeSessionPaymentPolicyModel.init(
  SessionPaymentPolicyColumns,
  {
    sequelize: connect(),
    modelName: MODEL_SESSION_PAYMENT_POLICY_NAME,
    tableName: MODEL_SESSION_PAYMENT_POLICY_NAME,
    freezeTableName: true,
    timestamps: false
  }
)

export default SequelizeSessionPaymentPolicyModel
