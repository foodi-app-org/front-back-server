import {
  GraphQLContext
} from '../../../../../shared/types/context'

import {
  TableServicesFactory
} from '../../../infrastructure/services'

import {
  MutationStoreTableCreateArgs
} from 'generated/graphql'

import {
  Table,
  TableStateEnum
} from '../../../domain/entities/tables.entity'

export const tableResolvers = {
  Query: {
    storeTables: async (
      _: unknown,
      __: unknown,
      context: GraphQLContext
    ) => {
      const services =
        TableServicesFactory(
          context?.restaurant ?? ''
        )

      const tables =
        await services.getAll.execute()

      return tables.map(
        mapTableToGraphQL
      )
    }
  },

  Mutation: {
    storeTableCreate: async (
      _: unknown,
      args: MutationStoreTableCreateArgs,
      context: GraphQLContext
    ) => {
      const services =
        TableServicesFactory(
          context?.restaurant ?? ''
        )

      const result =
        await services.create.execute({
          tableName: args.tableName,
          seats: args.seats ?? 0,
          section: args.section ?? '',
          tableState:
            mapTableState(
              args.tableState
            )
        })

      return {
        success: result.success,
        message: result.message,
        errors: null,
        data: result.data
          ? mapTableToGraphQL(
              result.data
            )
          : null
      }
    }
  }
}

/**
 * Maps domain Table entity to GraphQL StoreTable.
 */
const mapTableToGraphQL = (
  table: Table
) => {
  return {
    tableId: table.tableId,
    tableName: table.tableName,
    seats: table.seats,
    section: table.section,
    tableState: table.tableState,
    createdAt: table.createdAt,
    updatedAt: table.updatedAt
  }
}

/**
 * Maps GraphQL state to domain enum.
 */
const mapTableState = (
  state?: number | null
): TableStateEnum | undefined => {
  if (
    state === null ||
    state === undefined
  ) {
    return undefined
  }

  return Object.values(
    TableStateEnum
  ).includes(
    state as TableStateEnum
  )
    ? (state as TableStateEnum)
    : undefined
}