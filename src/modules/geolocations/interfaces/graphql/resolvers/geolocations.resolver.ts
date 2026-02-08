import { GraphQLResolveInfo } from "graphql";
import { GeolocationServices } from '../../../infrastructure/services'

export const geolocationsResolvers = {
  Query: {
    countries: async (_: GraphQLResolveInfo) => {
      const data = await GeolocationServices.getAllCountries.execute()
      return data?.data ?? null
    },
    getAllDepartments: async (_: GraphQLResolveInfo, args: { cId: string }) => {
      const { cId } = args
      const data = await GeolocationServices.getAllDepartmentsByCountryId.execute(cId)
      return data?.data ?? null
    },
    getAllCities: async (_: GraphQLResolveInfo, args: { dId: string }) => {
      const { dId } = args
      const data = await GeolocationServices.getAllCitiesByDepartmentId.execute(dId)
      return data?.data ?? null
    }
  },
  Mutation: {
  }
}
