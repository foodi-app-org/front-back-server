import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import path from 'path'

// Cargar archivos .gql desde subdirectorios
const typesArray = loadFilesSync(path.join(__dirname, '../../modules/**/*.gql'))

export const typeDefs = mergeTypeDefs(typesArray)
