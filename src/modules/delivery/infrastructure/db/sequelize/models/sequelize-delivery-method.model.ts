import { BIGINT, BOOLEAN, DATE, INTEGER, Model, STRING } from 'sequelize'
import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'
import type { DeliveryMethod, DeliveryMode } from '../../../../domain/entities/delivery-method.entity'
export const DELIVERY_METHOD_MODEL = 'delivery_methods'
export class SequelizeDeliveryMethod extends Model<DeliveryMethod, DeliveryMethod> implements DeliveryMethod {
  declare id: string; declare idStore: string; declare code: string; declare name: string; declare mode: DeliveryMode
  declare defaultFeeMinor: string | null; declare allowFeeOverride: boolean; declare active: boolean; declare revision: number
  declare createdBy: string | null; declare updatedBy: string | null; declare createdAt: Date; declare updatedAt: Date
}
export const columnsDeliveryMethod = {
  id: { type: STRING(36), primaryKey: true, allowNull: false }, idStore: { type: STRING(36), allowNull: false },
  code: { type: STRING(48), allowNull: false, unique: true }, name: { type: STRING(120), allowNull: false }, mode: { type: STRING(40), allowNull: false },
  defaultFeeMinor: { type: BIGINT, allowNull: true }, allowFeeOverride: { type: BOOLEAN, allowNull: false }, active: { type: BOOLEAN, allowNull: false },
  revision: { type: INTEGER, allowNull: false }, createdBy: { type: STRING(36), allowNull: true }, updatedBy: { type: STRING(36), allowNull: true },
  createdAt: { type: DATE, allowNull: false }, updatedAt: { type: DATE, allowNull: false }
}
SequelizeDeliveryMethod.init(columnsDeliveryMethod, { sequelize: connect(), modelName: DELIVERY_METHOD_MODEL, freezeTableName: true, timestamps: true })
