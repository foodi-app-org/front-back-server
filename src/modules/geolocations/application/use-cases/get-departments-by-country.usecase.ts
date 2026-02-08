
import { Departments } from '@modules/geolocations/domain/entities/departments.entity'
import { DepartmentsRepository } from '@modules/geolocations/domain/repositories/department.repository'

interface ResponseDepartments {
  success: boolean
  message: string
  data: Departments[] | null
}
/**
 * Use case responsible for retrieving Departments by country.
 */
export class GetAllDepartmentsByCountryUseCase {
  constructor(
    private readonly departmentsRepository: DepartmentsRepository
  ) { }

  async execute(cId: string): Promise<ResponseDepartments | null> {

    const data = await this.departmentsRepository.getDepartmentsByCountry(cId)

    return {
      success: true,
      message: 'Departments retrieved successfully',
      data: data ?? null
    }
  }
}
