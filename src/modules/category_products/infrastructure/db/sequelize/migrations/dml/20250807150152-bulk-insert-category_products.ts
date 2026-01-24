import { QueryInterface } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'

import { removeTenantPrefix } from '../../../../../../../shared/utils/tenant.utils'
import { CATEGORY_PRODUCT_MODEL } from '../../models/sequelize-model'

/**
 * Noun entry with metadata:
 * - word: displayed word
 * - gender: 'm' | 'f'
 * - number: 's' | 'p'
 * - tags: semantic tags used to pick compatible adjectives
 * - preferAdjBefore: if true, prefer "Adjective Noun" (e.g. "Dulce Especial")
 */
const NOUNS: {
  word: string
  gender: 'm' | 'f'
  number: 's' | 'p'
  tags: string[]
  preferAdjBefore?: boolean
}[] = [
  { word: 'Plato', gender: 'm', number: 's', tags: ['dish', 'food'] },
  { word: 'Platos', gender: 'm', number: 'p', tags: ['dish', 'food'] },
  { word: 'Combo', gender: 'm', number: 's', tags: ['dish', 'bundle'] },
  { word: 'Combos', gender: 'm', number: 'p', tags: ['dish', 'bundle'] },
  { word: 'Menú', gender: 'm', number: 's', tags: ['menu', 'offering'] },
  { word: 'Receta', gender: 'f', number: 's', tags: ['recipe', 'preparation'] },
  { word: 'Recetas', gender: 'f', number: 'p', tags: ['recipe', 'preparation'] },
  { word: 'Comida', gender: 'f', number: 's', tags: ['food', 'meal'] },
  { word: 'Alimento', gender: 'm', number: 's', tags: ['food', 'ingredient'] },
  { word: 'Alimentos', gender: 'm', number: 'p', tags: ['food', 'ingredient'] },
  {
    word: 'Sabor',
    gender: 'm',
    number: 's',
    tags: ['flavor'],
    preferAdjBefore: false
  },
  { word: 'Sabores', gender: 'm', number: 'p', tags: ['flavor'] },
  { word: 'Especial', gender: 'm', number: 's', tags: ['special'], preferAdjBefore: true },
  { word: 'Especiales', gender: 'm', number: 'p', tags: ['special'], preferAdjBefore: true },
  { word: 'Bocado', gender: 'm', number: 's', tags: ['bite', 'snack'] }
]

/**
 * Adjective entry with forms for gender/number and semantic tags.
 * forms keys: 'm_s', 'm_p', 'f_s', 'f_p'
 * tags: semantic categories indicating compatibility with nouns
 */
const ADJECTIVES: {
  forms: { m_s: string; m_p: string; f_s: string; f_p: string }
  tags: string[]
  blacklistNouns?: string[] // optionally avoid these specific noun words (exact match)
}[] = [
  {
    forms: { m_s: 'Delicioso', m_p: 'Deliciosos', f_s: 'Deliciosa', f_p: 'Deliciosas' },
    tags: ['quality', 'taste']
  },
  {
    forms: { m_s: 'Fresco', m_p: 'Frescos', f_s: 'Fresca', f_p: 'Frescas' },
    tags: ['freshness']
  },
  {
    forms: { m_s: 'Caliente', m_p: 'Calientes', f_s: 'Caliente', f_p: 'Calientes' },
    tags: ['temperature']
  },
  {
    forms: { m_s: 'Frío', m_p: 'Fríos', f_s: 'Fría', f_p: 'Frías' },
    tags: ['temperature']
  },
  {
    forms: { m_s: 'Clásico', m_p: 'Clásicos', f_s: 'Clásica', f_p: 'Clásicas' },
    tags: ['style', 'tradition']
  },
  {
    forms: { m_s: 'Premium', m_p: 'Premium', f_s: 'Premium', f_p: 'Premium' },
    tags: ['quality']
  },
  {
    forms: { m_s: 'Saludable', m_p: 'Saludables', f_s: 'Saludable', f_p: 'Saludables' },
    tags: ['health']
  },
  {
    forms: { m_s: 'Picante', m_p: 'Picantes', f_s: 'Picante', f_p: 'Picantes' },
    tags: ['taste', 'spicy']
  },
  {
    forms: { m_s: 'Dulce', m_p: 'Dulces', f_s: 'Dulce', f_p: 'Dulces' },
    tags: ['taste', 'sweet']
  },
  {
    forms: { m_s: 'Sabroso', m_p: 'Sabrosos', f_s: 'Sabrosa', f_p: 'Sabrosas' },
    tags: ['taste'],
    blacklistNouns: ['Sabor', 'Sabores'] // avoid tautology: "Sabor Sabroso"
  },
  {
    forms: { m_s: 'Tradicional', m_p: 'Tradicionales', f_s: 'Tradicional', f_p: 'Tradicionales' },
    tags: ['style', 'tradition']
  },
  {
    forms: { m_s: 'Moderno', m_p: 'Modernos', f_s: 'Moderna', f_p: 'Modernas' },
    tags: ['style', 'modern']
  },
  // Flavor-specific adjectives — better fit for "Sabor/Sabores"
  {
    forms: { m_s: 'Aromático', m_p: 'Aromáticos', f_s: 'Aromática', f_p: 'Aromáticas' },
    tags: ['flavor', 'aroma']
  },
  {
    forms: { m_s: 'Intenso', m_p: 'Intensos', f_s: 'Intensa', f_p: 'Intensas' },
    tags: ['flavor', 'intensity']
  },
  {
    forms: { m_s: 'Auténtico', m_p: 'Auténticos', f_s: 'Auténtica', f_p: 'Auténticas' },
    tags: ['flavor', 'authentic']
  },
  {
    forms: { m_s: 'Único', m_p: 'Únicos', f_s: 'Única', f_p: 'Únicas' },
    tags: ['flavor', 'unique']
  }
]

/**
 * Category seed shape
 */
type CategorySeed = {
  carProId: string
  pName: string
  pState: number
  idStore: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Chunk an array into smaller arrays
 * @param array input array
 * @param chunkSize size per chunk
 */
const chunkArray = <T,>(array: T[], chunkSize = 50): T[][] => {
  if (!Array.isArray(array)) throw new TypeError('array must be an array')
  if (typeof chunkSize !== 'number' || chunkSize <= 0)
    throw new TypeError('chunkSize must be a positive number')

  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}

/**
 * Normalize words for simple comparisons (lowercase, remove accents)
 * @param s input string
 */
const normalize = (s: string): string =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')

/**
 * Check if adjective is tautological with noun (simple heuristics)
 * e.g. ("Sabor", "Sabroso") -> avoid
 * Uses blacklistNouns and root overlap heuristics.
 *
 * @param nounWord raw noun word
 * @param adjForm adjective form (selected)
 * @param adjEntry adjective entry (to check blacklist)
 */
const isTautological = (
  nounWord: string,
  adjForm: string,
  adjEntry?: { blacklistNouns?: string[] }
): boolean => {
  const nounNorm = normalize(nounWord)
  const adjNorm = normalize(adjForm)

  // explicit blacklist
  if (adjEntry?.blacklistNouns) {
    if (adjEntry.blacklistNouns.map(normalize).includes(nounNorm)) return true
  }

  // avoid identical roots: if adjective contains noun root or viceversa for first 4 chars
  const nounRoot = nounNorm.slice(0, 4)
  const adjRoot = adjNorm.slice(0, 4)
  if (nounRoot && adjRoot && nounRoot === adjRoot) return true

  // avoid exact word duplicates (rare)
  if (nounNorm === adjNorm) return true

  return false
}

/**
 * Pick an adjective compatible with noun by tags and agreement.
 * Guarantees grammatical agreement and avoids tautology.
 *
 * @param noun noun object from NOUNS
 */
const pickCompatibleAdjective = (noun: {
  word: string
  gender: 'm' | 'f'
  number: 's' | 'p'
  tags: string[]
}) => {
  const nounTags = new Set(noun.tags)

  // filter adjectives by tag compatibility and not blacklisted for this noun
  const candidates = ADJECTIVES.filter(adj =>
    adj.tags.some(t => nounTags.has(t))
  )

  // if we have candidates specific to noun tags, try them first
  const tryList = candidates.length ? candidates : ADJECTIVES

  // shuffle tryList (simple Fisher-Yates)
  for (let i = tryList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[tryList[i], tryList[j]] = [tryList[j], tryList[i]]
  }

  for (const adj of tryList) {
    const key = `${noun.gender}_${noun.number}` as 'm_s' | 'm_p' | 'f_s' | 'f_p'
    const form = adj.forms[key]

    if (!form) continue
    if (isTautological(noun.word, form, adj)) continue

    return { form, adjEntry: adj }
  }

  // fallback: pick any adjective that isn't tautological
  for (const adj of ADJECTIVES) {
    const key = `${noun.gender}_${noun.number}` as 'm_s' | 'm_p' | 'f_s' | 'f_p'
    const form = adj.forms[key]
    if (!form) continue
    if (isTautological(noun.word, form, adj)) continue
    return { form, adjEntry: adj }
  }

  // last resort: return a neutral adjective adapted to gender/number
  return {
    form: noun.gender === 'f' ? (noun.number === 's' ? 'Especial' : 'Especiales') : noun.number === 's' ? 'Especial' : 'Especiales',
    adjEntry: undefined
  }
}

/**
 * Generate a semantically correct Spanish category name (smart ordering & agreement).
 * - uses noun.allowedTags to pick adjectives
 * - places adjective before noun when noun.preferAdjBefore === true
 *
 * @param usedNames set of previously used names
 * @param maxAttempts attempts before numeric suffix
 */
const generateUniqueCategoryName = (usedNames: Set<string>, maxAttempts = 10): string => {
  if (!(usedNames instanceof Set)) throw new TypeError('usedNames must be a Set')

  let attempt = 0
  let base = ''
  let candidate = ''

  while (attempt < maxAttempts) {
    attempt += 1

    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
    const { form: adjective } = pickCompatibleAdjective(noun)

    // choose ordering: some nouns prefer adjective before (e.g. "Dulce Especial"),
    // otherwise use the more common "Noun Adjective" (e.g. "Plato Delicioso")
    base = noun.preferAdjBefore ? `${adjective} ${noun.word}` : `${noun.word} ${adjective}`

    if (!usedNames.has(base)) {
      usedNames.add(base)
      return base
    }
  }

  // numeric suffix fallback
  let suffixIndex = 1
  do {
    candidate = `${base} ${suffixIndex}`
    suffixIndex += 1
  } while (usedNames.has(candidate))

  usedNames.add(candidate)
  return candidate
}

/**
 * Generate N random categories with unique names
 * @param total number of categories to generate
 * @param idStore store identifier
 */
const generateRandomCategories = (total: number, idStore: string): CategorySeed[] => {
  if (typeof total !== 'number' || total <= 0) throw new TypeError('total must be a positive number')
  if (!idStore) throw new TypeError('idStore is required')

  const now = new Date()
  const usedNames = new Set<string>()
  const categories: CategorySeed[] = []

  for (let i = 0; i < total; i += 1) {
    const pName = generateUniqueCategoryName(usedNames)
    categories.push({
      carProId: uuidv4(),
      pName,
      pState: 1,
      idStore,
      createdAt: now,
      updatedAt: now
    })
  }

  return categories
}

/**
 * Inserts data in chunks to avoid memory issues
 * @param queryInterface sequelize QueryInterface
 * @param schemaName target schema
 * @param data rows to insert
 * @param chunkSize chunk size (default 50)
 */
const bulkInsertInChunks = async (
  queryInterface: QueryInterface,
  schemaName: string,
  data: CategorySeed[],
  chunkSize = 50
): Promise<void> => {
  if (!queryInterface) throw new TypeError('queryInterface is required')
  if (!schemaName) throw new TypeError('schemaName is required')
  if (!Array.isArray(data)) throw new TypeError('data must be an array')

  const chunks = chunkArray(data, chunkSize)

  for (const chunk of chunks) {
    try {
      await queryInterface.bulkInsert(
        { schema: schemaName, tableName: CATEGORY_PRODUCT_MODEL },
        chunk
      )
    } catch (err: any) {
      const message = `bulkInsert failed for schema=${schemaName} chunkSize=${chunk.length}: ${err?.message ?? err}`
      const e = new Error(message)
      ;(e as any).original = err
      throw e
    }
  }
}

/**
 * Seed random category_products records
 * @param queryInterface sequelize QueryInterface
 * @param schemaName target schema (tenant schema)
 * @param total optional number of records to create (default 1000)
 */
export const up = async (queryInterface: QueryInterface, schemaName: string, total = 1000): Promise<void> => {
  if (!queryInterface) throw new Error('queryInterface is required')
  if (!schemaName) throw new Error('schemaName is required')

  const idStore = removeTenantPrefix(schemaName)
  const categories = generateRandomCategories(total, idStore)

  await bulkInsertInChunks(queryInterface, schemaName, categories, 50)
}

/**
 * Removes seeded categories (safe rollback)
 * @param queryInterface sequelize QueryInterface
 * @param schemaName target schema
 */
export const down = async (queryInterface: QueryInterface, schemaName: string): Promise<void> => {
  if (!queryInterface) throw new Error('queryInterface is required')
  if (!schemaName) throw new Error('schemaName is required')

  const idStore = removeTenantPrefix(schemaName)

  try {
    await queryInterface.bulkDelete(
      { schema: schemaName, tableName: CATEGORY_PRODUCT_MODEL },
      { idStore }
    )
  } catch (err: any) {
    const message = `bulkDelete failed for schema=${schemaName}: ${err?.message ?? err}`
    const e = new Error(message)
    ;(e as any).original = err
    throw e
  }
}
