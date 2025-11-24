import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    "src/modules/**/*.gql",
    "src/modules/**/*.graphql",
    'src/shared/infrastructure/graphql/types/*.gql'
  ],
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers"]
    }
  }
};

export default config;
