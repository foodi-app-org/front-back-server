import {
 GraphQLScalarType, 
 Kind, 
 ValueNode 
} from 'graphql'
import { DateTime } from 'luxon'

/**
 * GraphQL custom scalar for handling dates in UTC-5 with format "YYYY-MM-DD HH:mm:ss.SSS ±HH:MM".
 * Uses Luxon for parsing and formatting.
 */
export const dateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description:
    'Custom scalar for UTC-5 dates in format "YYYY-MM-DD HH:mm:ss.SSS ±HH:MM"',

  /**
   * Serializes a Date object or string to the specified UTC-5 format.
   * @param value - The date to serialize.
   * @returns The formatted date string in UTC-5.
   */
  serialize(value: unknown): string {
    if (!(value instanceof Date) && typeof value !== 'string') {
      throw new TypeError(
        `Value is not an instance of Date or a valid date string: ${value}`
      )
    }

    const date = typeof value === 'string' ? new Date(value) : value

    if (isNaN(date.getTime())) {
      throw new TypeError(`Invalid date: ${value}`)
    }

    return DateTime.fromJSDate(date, { zone: 'UTC-5' }).toFormat(
      'yyyy-MM-dd HH:mm:ss.SSS ZZZ'
    )
  },

  /**
   * Parses a date string from a GraphQL variable.
   * @param value - The input value from the client.
   * @returns The parsed Date object.
   */
  parseValue(value: unknown): Date {
    if (typeof value !== 'string') {
      throw new TypeError(`Value is not a string: ${value}`)
    }

    const dt = DateTime.fromISO(value, { zone: 'UTC-5' })
    if (!dt.isValid) {
      throw new TypeError(`Invalid date format: ${value}`)
    }

    return dt.toJSDate()
  },

  /**
   * Parses an AST literal (inline GraphQL query value).
   * @param ast - The AST node.
   * @returns The parsed Date object.
   */
  parseLiteral(ast: ValueNode): Date {
    if (ast.kind !== Kind.STRING) {
      throw new TypeError(`Can only parse strings to dates, got: ${ast.kind}`)
    }

    const dt = DateTime.fromISO(ast.value, { zone: 'UTC-5' })
    if (!dt.isValid) {
      throw new TypeError(`Invalid date format: ${ast.value}`)
    }

    return dt.toJSDate()
  }
})
