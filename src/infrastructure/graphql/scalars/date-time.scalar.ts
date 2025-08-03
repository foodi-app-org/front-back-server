import { GraphQLScalarType, Kind, ValueNode } from 'graphql'

/**
 * Custom GraphQL scalar type for handling DateTime with UTC-5 adjustment.
 */
export const dateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type (ISO string with UTC-5 adjustment)',

  /**
   * Serializes outgoing Date to ISO string in UTC-5.
   * @param value - Value to serialize.
   * @returns ISO 8601 formatted string.
   */
  serialize(value: unknown): string {
    const date = value instanceof Date ? new Date(value.getTime()) : new Date(value as string)
    date.setUTCHours(date.getUTCHours() - 5)
    return date.toISOString()
  },

  /**
   * Parses incoming client value to Date.
   * @param value - Client-provided input.
   * @returns Date object.
   */
  parseValue(value: unknown): Date {
    return new Date(value as string)
  },

  /**
   * Parses GraphQL AST literal to Date.
   * @param ast - AST node from client query.
   * @returns Date object or null.
   */
  parseLiteral(ast: ValueNode): Date | null {
    if (ast.kind === Kind.STRING) {
      const date = new Date(ast.value)
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(ast.value)) {
        return date
      }
      date.setHours(0, 0, 0, 0)
      return date
    }
    return null
  }
})
