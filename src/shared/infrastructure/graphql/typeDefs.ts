import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import path from 'path'

/**
 * Load global shared .gql files
 */
const sharedTypes = loadFilesSync(
  path.join(__dirname, '../graphql/types/**/*.gql')
)

/**
 * Load per-module .gql files (queries, mutations, etc.)
 */
const moduleTypes = loadFilesSync(
  path.join(__dirname, '../../../modules/**/*.gql')
)

export const typeDefs = mergeTypeDefs([
  ...sharedTypes,
  ...moduleTypes
])
