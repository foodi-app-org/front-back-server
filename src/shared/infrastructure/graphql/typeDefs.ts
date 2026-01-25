import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import path from 'node:path'
import fs from 'node:fs'
import { Kind } from 'graphql'

/**
 * Resolve runtime root (src in dev, build/dist in prod)
 */
const resolveRoot = (): string => {
  const roots = ['src', 'build', 'dist']
    .map(dir => path.resolve(process.cwd(), dir))
    .filter(p => fs.existsSync(p) && fs.statSync(p).isDirectory())

  if (!roots.length) {
    throw new Error('[graphql] No valid runtime root found')
  }

  return roots[0]
}

/**
 * Load and merge GraphQL type definitions
 */
const loadMergedTypeDefs = () => {
  const root = resolveRoot()

  // 👇 REAL path where your shared scalars already live
  const sharedPatterns = [
    path.join(root, 'shared', 'infrastructure', 'graphql', 'types', '**', '*.{gql,graphql}'),
    // optional fallback if you ever move them
    path.join(root, 'shared', 'graphql', 'types', '**', '*.{gql,graphql}')
  ].map(p => p.replace(/\\/g, '/'))

  const modulesPattern = path
    .join(root, 'modules', '**', '*.{gql,graphql}')
    .replace(/\\/g, '/')

  const shared = sharedPatterns.flatMap(pattern =>
    loadFilesSync(pattern, { ignoreIndex: true })
  )

  const modules = loadFilesSync(modulesPattern, { ignoreIndex: true })

  if (!shared.length) {
    throw new Error(
      `[graphql] Shared typeDefs not found. Tried: ${sharedPatterns.join(', ')}`
    )
  }

  if (!modules.length) {
    throw new Error(
      `[graphql] Module typeDefs not found at ${modulesPattern}`
    )
  }

  console.log(`[graphql] Loaded ${shared.length} shared typeDefs`)
  console.log(`[graphql] Loaded ${modules.length} module typeDefs`)

  // ⚠️ Order matters: shared FIRST
  return mergeTypeDefs([...shared, ...modules])
}

/**
 * Extract object & input type names (debug helper)
 */
const extractTypeNames = (doc: any): string[] =>
  doc.definitions
    .filter(
      (d: any) =>
        d.kind === Kind.OBJECT_TYPE_DEFINITION ||
        d.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION
    )
    .map((d: any) => d.name.value)

/* -------------------------------------------------------------------------- */

export const typeDefs = loadMergedTypeDefs()

// optional debug
const merged = loadMergedTypeDefs()
console.log('Loaded type names:', extractTypeNames(merged).sort())
