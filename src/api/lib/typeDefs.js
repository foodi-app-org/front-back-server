import path from 'path'

import { mergeTypeDefs } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'

// Cargar archivos .gql desde subdirectorios
const typesArray = loadFilesSync(path.join(__dirname, '../lib/types/**/*.gql'))

module.exports = mergeTypeDefs(typesArray)
