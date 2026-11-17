import {
  GraphQLScalarType,
  Kind,
  ValueNode
} from 'graphql'

import { DateTime } from 'luxon'

/**
 * GraphQL custom DateTime scalar.
 *
 * Supports:
 * - JavaScript Date objects
 * - ISO 8601 date strings
 * - Date strings with explicit UTC offsets
 * - Unix timestamps in milliseconds
 * - Numeric timestamp strings (13 digits)
 *
 * Serializes dates using the application's UTC-5 format:
 * yyyy-MM-dd HH:mm:ss.SSS ZZZ
 */
const DATE_TIME_ZONE = 'UTC-5'
const DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss.SSS ZZZ'

const normalizeDate = (value: unknown): Date => {
  if (value instanceof Date) {
    if (!Number.isFinite(value.getTime())) {
      throw new TypeError('Invalid Date object')
    }

    return value
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new TypeError(`Invalid timestamp: ${value}`)
    }

    const date = new Date(value)

    if (!Number.isFinite(date.getTime())) {
      throw new TypeError(`Invalid timestamp: ${value}`)
    }

    return date
  }

  if (typeof value === 'string') {
    const normalized = value.trim()

    if (!normalized) {
      throw new TypeError('DateTime cannot be empty')
    }

    // Unix timestamps en milisegundos
    if (/^-?\d{13}$/.test(normalized)) {
      const date = new Date(Number(normalized))

      if (!Number.isFinite(date.getTime())) {
        throw new TypeError(`Invalid timestamp: ${normalized}`)
      }

      return date
    }

    // ISO 8601
    let parsed = DateTime.fromISO(normalized, {
      zone: 'UTC-5'
    })

    // PostgreSQL:
    // 2026-11-16 15:19:03.788 +00:00
    if (!parsed.isValid) {
      parsed = DateTime.fromSQL(normalized, {
        zone: 'UTC-5'
      })
    }

    if (!parsed.isValid) {
      throw new TypeError(
        `Invalid DateTime string: ${normalized}`
      )
    }

    return parsed.toJSDate()
  }

  throw new TypeError(
    `Unsupported DateTime value: ${String(value)}`
  )
}

/**
 * Parses a DateTime provided as a GraphQL input.
 *
 * The input accepts ISO 8601 strings.
 * If no timezone is supplied, UTC-5 is assumed.
 */
const parseInputDate = (value: unknown): Date => {
  if (typeof value !== 'string') {
    throw new TypeError(
      `DateTime input must be a string: ${String(value)}`
    )
  }

  const parsed = DateTime.fromISO(value.trim(), {
    zone: DATE_TIME_ZONE
  })

  if (!parsed.isValid) {
    throw new TypeError(
      `Invalid DateTime input: ${value}`
    )
  }

  return parsed.toJSDate()
}

/**
 * GraphQL scalar for date and time values.
 *
 * All output values are formatted in UTC-5.
 */
export const dateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',

  description:
    'DateTime scalar supporting Date, ISO strings and Unix ' +
    'timestamps in milliseconds. Output format: ' +
    'yyyy-MM-dd HH:mm:ss.SSS ZZZ (UTC-5).',

  /**
   * Converts a value returned by a GraphQL resolver
   * into the public DateTime string representation.
   */
  serialize(value: unknown): string {
    const date = normalizeDate(value)

    const formatted = DateTime.fromJSDate(date, {
      zone: DATE_TIME_ZONE
    })

    if (!formatted.isValid) {
      throw new TypeError(
        `Unable to serialize DateTime: ${String(value)}`
      )
    }

    return formatted.toFormat(DATE_TIME_FORMAT)
  },

  /**
   * Parses variables provided to GraphQL operations.
   */
  parseValue(value: unknown): Date {
    return parseInputDate(value)
  },

  /**
   * Parses inline GraphQL literals.
   */
  parseLiteral(ast: ValueNode): Date {
    if (ast.kind !== Kind.STRING) {
      throw new TypeError(
        `DateTime literal must be a string, received: ${ast.kind}`
      )
    }

    return parseInputDate(ast.value)
  }
})