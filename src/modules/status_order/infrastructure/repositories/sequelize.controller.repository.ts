import { Transaction } from 'sequelize'

import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { GenericService } from '../../../../shared/infrastructure/persistence'
import { StatusOrder, StatusOrderPagination } from '../../domain/entities/status_order.entity'
import { StatusOrderRepository } from '../../domain/repositories/status_order.repository'
import type { SequelizeStatusOrderModel } from '../db/sequelize/models/sequelize-status_orders.model'

export class SequelizeStatusOrderRepository implements StatusOrderRepository {
  private readonly genericService: GenericService<SequelizeStatusOrderModel>
  private readonly tenant: string

  constructor(tenant: string) {
    this.genericService = new GenericService(models.StatusOrder.schema(tenant))
    this.tenant = tenant || MigrationFolder.Public
  }

  async create(data: StatusOrder, transaction?: Transaction): Promise<StatusOrder | null> {
    try {
      const created = await models.StatusOrder.schema(this.tenant).create({
        ...data
      }, { transaction })
      return created
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  async findCodeRef(pCodeRef: string): Promise<StatusOrder | null> {
    try {
      const scheduleStore = await models.StatusOrder.schema(this.tenant).findOne({
        where: { pCodeRef: String(pCodeRef) }
      })
      return scheduleStore  
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  async getAll(idStore: string): Promise<StatusOrderPagination | null> {
    try {
      const result = await this.genericService.getAll({
        searchFields: ['pCodeRef'],
        idStore
      })

      return result
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
  async findById(id: string): Promise<StatusOrder | null> {
    try {
      const statusOrder = await models.StatusOrder.schema(this.tenant).findOne({ where: { stPId: id } })
      if (!statusOrder) {
        return null
      }
      return statusOrder
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}