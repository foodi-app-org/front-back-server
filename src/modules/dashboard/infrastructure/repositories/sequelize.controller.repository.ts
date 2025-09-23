
import os from 'os'
import { Op } from 'sequelize'

import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import {
  DashboardComponents, DashboardComponentUpdateInput
} from '../../domain/entities/dashboard-components.entity'
import { DashboardComponentsRepository } from '../../domain/repositories/dashboard-components.repository'


export class SequelizeDashboardComponentsRepository implements DashboardComponentsRepository {
  private readonly tenant: string = MigrationFolder.Public

  constructor(tenant: string) {
    this.tenant = tenant ?? MigrationFolder.Public
  }
  async getAll(): Promise<DashboardComponents[] | null> {
    try {
      const dashboardComponents = await models.DashboardComponents.schema(this.tenant).findAll()
      return dashboardComponents
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
  async update(input: DashboardComponentUpdateInput[]): Promise<DashboardComponents[] | null> {
    try {
      const ids = input.map(c => c.id)
      const existingComponents = await models.DashboardComponents.schema(this.tenant).findAll({
        where: {
          name: { [Op.in]: ids }
        }
      })
      // Map the existing components to their updated values
      const mappedComponents = existingComponents.map(component => {
        const updatedData = input.find(c => c.id === component.name)
        // Ensure coordinates has all required properties and types
        const prevCoordinates = component.get({ plain: true }).coordinates
        const coordinates = {
          x: updatedData?.coordinates?.x ?? prevCoordinates.x,
          y: updatedData?.coordinates?.y ?? prevCoordinates.y,
          w: updatedData?.coordinates?.w ?? prevCoordinates.w,
          h: updatedData?.coordinates?.h ?? prevCoordinates.h,
          name: prevCoordinates.name,
          moved: prevCoordinates.moved,
          static: prevCoordinates.static,
          title: prevCoordinates.title,
          id: component.name
        }
        return {
          ...component.get({ plain: true }),
          ...updatedData,
          id: component.id,
          coordinates
        }
      })
      console.log('🚀 ~ SequelizeDashboardComponentsRepository ~ update ~ mappedComponents:', mappedComponents)
      // Update the components in the database
      await Promise.all(mappedComponents.map(component => {
        return models.DashboardComponents.schema(this.tenant).update(component, {
          where: { id: component.id }
        })
      }))
      const updatedTitles = input.map(c => c.title).filter((t): t is string => typeof t === 'string')
      const updatedComponents = await models.DashboardComponents.schema(this.tenant).findAll({
        where: {
          title: { [Op.in]: updatedTitles }
        }
      })
      return updatedComponents
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
  async getLocalBackendIp(): Promise<string | null> {
    function getLocalIp() {
      const interfaces = os.networkInterfaces()
      for (const iface of Object.values(interfaces)) {
        if (!iface) continue
        for (const config of iface) {
          if (config.family === 'IPv4' && !config.internal) {
            return config.address
          }
        }
      }
      return 'localhost'
    }
    return getLocalIp()
  }
}