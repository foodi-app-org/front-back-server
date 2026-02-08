
import { Cities } from '@modules/geolocations/domain/entities/cities.entity'
import { CitiesRepository } from '@modules/geolocations/domain/repositories/cities.repository'

interface ResponseCities {
  success: boolean
  message: string
  data: Cities[] | null
}
/**
 * Use case responsible for retrieving Cities by department.
 */
export class GetAllCitiesByDepartmentUseCase {
  constructor(
    private readonly citiesRepository: CitiesRepository
  ) { }

  async execute(dId: string): Promise<ResponseCities | null> {

    const data = await this.citiesRepository.getCitiesByDepartment(dId)

    return {
      success: true,
      message: 'Cities retrieved successfully',
      data: data ?? null
    }
  }
}
