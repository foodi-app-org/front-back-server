
import { GetAllICountriesUseCase } from "@modules/geolocations/application/use-cases/get-all-countries.usecase"
import { SequelizeCountriesRepository } from "../repositories/sequelize.counties.controller.repository"
import type { CountriesRepository } from "@modules/geolocations/domain/repositories/countries.repository"
import { MigrationFolder } from "@shared/infrastructure/db/sequelize/migrations/umzug.config"
import { DepartmentsRepository } from "@modules/geolocations/domain/repositories/department.repository"
import { GetAllDepartmentsByCountryUseCase } from "@modules/geolocations/application/use-cases/get-departments-by-country.usecase"
import { SequelizeDepartmentsRepository } from "../repositories/sequelize.departments.controller.repository"
import { GetAllCitiesByDepartmentUseCase } from "@modules/geolocations/application/use-cases/get-cities-by-department.usecase"
import { CitiesRepository } from "@modules/geolocations/domain/repositories/cities.repository"
import { SequelizeCitiesRepository } from "../repositories/sequelize.cities.controller.repository"

const countriesRepository: CountriesRepository = new SequelizeCountriesRepository(MigrationFolder.Public)
const departmentsRepository: DepartmentsRepository = new SequelizeDepartmentsRepository(MigrationFolder.Public)
const citiesRepository: CitiesRepository = new SequelizeCitiesRepository(MigrationFolder.Public)

export const GeolocationServices = {
    getAllCountries: new GetAllICountriesUseCase(countriesRepository),
    getAllDepartmentsByCountryId: new GetAllDepartmentsByCountryUseCase(departmentsRepository),
    getAllCitiesByDepartmentId:  new GetAllCitiesByDepartmentUseCase(citiesRepository)
}