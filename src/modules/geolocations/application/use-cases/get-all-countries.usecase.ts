
import { ICountries, Countries } from '../../domain/entities/countries.entity'
import { CountriesRepository } from '@modules/geolocations/domain/repositories/countries.repository'

/**
 * Input DTO to create a Countries.
 */
export type CreateICountriesDTO = ICountries  

interface ResponseCountries {
  success: boolean
  message: string
  data: Countries[] | null
}
/**
 * Use case responsible for creating a Countries.
 */
export class GetAllICountriesUseCase {
  constructor(
    private readonly countriesRepository: CountriesRepository
  ) { }

  async execute(): Promise<ResponseCountries | null> {

    const data = await this.countriesRepository.getAll()

    return {
      success: true,
      message: 'Countries retrieved successfully',
      data: data ?? null
    }
  }
}
