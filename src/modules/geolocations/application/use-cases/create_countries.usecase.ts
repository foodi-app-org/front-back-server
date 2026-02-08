
import { Transaction } from 'sequelize'

import { ICountries, Countries } from '../../domain/entities/countries.entity'
import { CountriesRepository } from '@modules/geolocations/domain/repositories/countries.repository'

/**
 * Input DTO to create a Countries.
 */
export type CreateICountriesDTO = ICountries  

interface ResponseCountries {
  success: boolean
  message: string
  data: Countries | null
}
/**
 * Use case responsible for creating a Countries.
 */
export class CreateICountriesTypeUseCase {
  constructor(
    private readonly countriesRepository: CountriesRepository
  ) { }

  /**
   * Executes the use case to create a Countries.
   * @param input - store data
   * @returns The newly created Store or null if it already exists
   */
  async execute(input: CreateICountriesDTO, transaction?: Transaction): Promise<ResponseCountries | null> {
    // sum price of product by cantProducts
    const newICountries = new Countries({
      ...input
    })

    const created = await this.countriesRepository.create(newICountries, transaction)

    return {
      success: true,
      message: 'Countries created successfully',
      data: created
    }
  }
}
