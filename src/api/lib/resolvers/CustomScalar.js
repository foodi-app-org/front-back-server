import { GraphQLScalarType, Kind } from 'graphql'

const dateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'Date custom scalar type',
  serialize(value) {
    // Ensure the value is a Date instance
    const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
    // Adjust timezone by subtracting 5 hours (UTC-5)
    date.setUTCHours(date.getUTCHours() - 5);
    // Return the date in ISO 8601 format
    return date.toISOString();
  },
  parseValue (value) {
    return new Date(value) // Convert incoming integer to Date
  },
  parseLiteral (ast) {
    if (ast.kind === Kind.STRING) {
      const date = new Date(ast.value)
      // Check if the value matches 'YYYY-MM-DDTHH:mm:ss.sssZ'
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(ast.value)) {
        return date
      }
      // If the value doesn't match the specific format, set time to start of day
      date.setHours(0, 0, 0, 0)
      return date
    }
    return null
  }
})

export default {
  dateTimeScalar
}
