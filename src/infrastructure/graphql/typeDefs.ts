import path from 'path'

import { mergeTypeDefs } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'

// Cargar archivos .gql desde subdirectorios
const typesArray = loadFilesSync(path.join(__dirname, '../../modules/**/*.gql'))

export const typeDefs = mergeTypeDefs(typesArray)
