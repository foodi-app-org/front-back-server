import { GraphQLError } from 'graphql'

/**
 * Utility class to validate GraphQL context and session integrity.
 */
export class ContextValidator {
  /**
   * @param {object} context - The GraphQL context passed to resolvers.
   */
  constructor (context) {
    this.context = context
  }

  /**
   * Validates that the user session is active and associated with a store.
   * @throws {GraphQLError} If session is invalid or expired.
   * @returns {string} The store ID from session (context.restaurant).
   */
  validateUserSession() {
    const hasStore = this.context?.restaurant
    const hasUserStore = this.context?.User?.restaurant?.idStore

    if (!hasStore || !hasUserStore) {
      throw new GraphQLError('Session expired', {
        extensions: {
          code: 'FORBIDDEN',
          http: { status: 401 }
        }
      })
    }

    return this.context.restaurant
  }
}
