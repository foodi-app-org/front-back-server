import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import {
  CreateFilterConfigUseCase,
  GetAllFilterConfigsUseCase,
  GetOneFilterConfigUseCase
} from '../../application'
import { SequelizeFilterConfigRepository } from '../repositories/sequelize-filter-config.repository'

const filterConfigRepository = new SequelizeFilterConfigRepository(MigrationFolder.Public)

export const Services = {
  getAll: new GetAllFilterConfigsUseCase(filterConfigRepository),
  getOne: new GetOneFilterConfigUseCase(filterConfigRepository),
  create: new CreateFilterConfigUseCase(filterConfigRepository)
}
