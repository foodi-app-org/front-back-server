import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { DepartmentsRepository } from '../../domain/repositories/department.repository'
import { Departments, StateDepartments } from '@modules/geolocations/domain/entities/departments.entity'
import { MigrationFolder } from '@shared/infrastructure/db/sequelize/migrations/umzug.config'

export class SequelizeDepartmentsRepository implements DepartmentsRepository {
  private readonly tenant: string = MigrationFolder.Public

  constructor(tenant: string) {
    this.tenant = tenant ?? MigrationFolder.Public
  }
  // @ts-ignore
  async getAll(): Promise<Departments[] | null> {
    try {
      const Departments = await models.Departments.schema(this.tenant).findAll({
        where: {
          dState: StateDepartments.ACTIVE
        }
      })
      return Departments as unknown as Departments[]
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
  async getDepartmentsByCountry(cId: string): Promise<Departments[] | null> {
    try {
      const Departments = await models.Departments.schema(this.tenant).findAll({
        where: {
          cId,
          dState: StateDepartments.ACTIVE
        }
      })
      return Departments as unknown as Departments[]
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }

      throw new Error(String(e))
    }
  }
}