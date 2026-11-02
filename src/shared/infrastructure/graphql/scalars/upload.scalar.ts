import { GraphQLUpload } from 'graphql-upload-ts'

/**
 * Custom scalar for handling file uploads (graphql-multipart-request-spec).
 *
 * NOTE: graphql-upload-ts v2 exposes `GraphQLUpload` as a NAMED export (there is
 * no default export). Importing it as default resolved to `undefined`, which
 * silently disabled the `Upload` scalar.
 */
export const uploadScalar = GraphQLUpload
