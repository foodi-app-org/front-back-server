import { GraphQLScalarType, Kind } from 'graphql'

const dateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'Date custom scalar type',
  serialize (value) {
    return value.getTime() // Convert outgoing Date to integer for JSON
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
