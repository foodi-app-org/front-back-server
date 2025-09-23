import { GraphQLError } from 'graphql'

import { GraphQLContext } from '../types/context'

export const SESSION_EXPIRED = 'Session expired'
export const FORBIDDEN = 'FORBIDDEN'
/**
 * Utility class to validate GraphQL context and session integrity.
 */
export class ContextValidator {
  private readonly context: GraphQLContext

  /**
   * @param {object} context - The GraphQL context passed to resolvers.
   */
  constructor (context: GraphQLContext) {
    this.context = context
  }

  /**
   * Validates that the user session is active and associated with a store.
   * @throws {GraphQLError} If session is invalid or expired.
   * @returns {string} The store ID from session (context.restaurant).
   */
  validateUserSession (context: GraphQLContext = this.context): string | null {
    const hasStore = context?.restaurant ?? null

    if (!hasStore) {
      throw new GraphQLError(SESSION_EXPIRED, {
        extensions: {
          code: FORBIDDEN,
          http: { status: 401 }
        }
      })
    }

    return this.context.restaurant ?? null
  }
}
