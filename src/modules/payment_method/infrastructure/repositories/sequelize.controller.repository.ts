import { Transaction } from 'sequelize'

import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { PaymentMethod } from '../../domain/entities/payment-method.entity'
import { PaymentMethodRepository } from '../../domain/repositories/module.repository'
import { PaymentMethodState, PaymentMethodType } from '../db/sequelize/models/sequelize-payment_method.model'

export class SequelizePaymentMethodRepository implements PaymentMethodRepository {
  private readonly tenant: string = MigrationFolder.Public

  constructor(tenant: string) {
    this.tenant = tenant ?? MigrationFolder.Public
  }

  async create(data: PaymentMethod, transaction?: Transaction): Promise<PaymentMethod | null> {
    try {
      const created = await models.PaymentMethod.create({
        ...data,
        state: PaymentMethodState.ACTIVE,
        type: PaymentMethodType.DYNAMIC,
        createdAt: new Date(),
        updatedAt: new Date()
      }, { transaction })
      return created
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
  async getAll(): Promise<PaymentMethod[]> {
    try {
      const paymentMethods = await models.PaymentMethod.schema(this.tenant).findAll({
        where: {
          state: PaymentMethodState.ACTIVE
        },
        order: [['paymentPriority', 'ASC']]
      })
      return paymentMethods
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  async getOneById(id: string): Promise<PaymentMethod | null> {
    try {
      const paymentMethod = await models.PaymentMethod.schema(this.tenant).findOne({
        where: {
          payId: id,
          state: PaymentMethodState.ACTIVE
        },
        raw: true
      })
      return paymentMethod
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}