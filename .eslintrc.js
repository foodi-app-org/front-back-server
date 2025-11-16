module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'import',
    'simple-import-sort',
    'unused-imports',
    'boundaries'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier'
  ],
  env: {
    node: true,
    es2021: true
  },
  ignorePatterns: ['dist/', 'node_modules/'],
  rules: {
    // 💣 Clean code
    'no-console': 'warn', // console -> warning
    'no-debugger': 'error',
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'comma-dangle': ['error', 'never'],

    // Whitespace & blank lines (strict)
    'no-trailing-spaces': ['error', { skipBlankLines: false, ignoreComments: false }],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
    'no-irregular-whitespace': 'error',
    'no-multi-spaces': ['error', { ignoreEOLComments: false }],
    'eol-last': ['error', 'always'],
    'object-curly-spacing': ['error', 'always'],
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: false }],
    'padding-line-between-statements': [
      'error',
      // blank line before return
      { blankLine: 'always', prev: '*', next: 'return' },
      // group variable declarations
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      { blankLine: 'never', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] }
    ],

    // 🚀 TypeScript
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { vars: 'all', args: 'after-used', argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
    ],

    // 🔥 Remove garbage
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',

    // 🧹 Import sorting
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    // 📦 Import order
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
        'newlines-between': 'always'
      }
    ],

    // Enforce newline for imports with more than 2 props
    'object-curly-newline': [
      'error',
      {
        ImportDeclaration: { minProperties: 3, multiline: true, consistent: true }
      }
    ],

    // Best practices
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'arrow-body-style': ['error', 'as-needed'],
    'consistent-return': 'error',
    'no-var': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',

    // 🧠 Hexagonal: avoid cross imports
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/infrastructure/**', '**/interface/**'],
            message: 'Application layer should not import from infrastructure or interface'
          }
        ]
      }
    ],

    // 🧠 Hexagonal boundaries
    'boundaries/element-types': [
      'error',
      {
        default: 'disallow',
        rules: [
          { from: 'domain', allow: [] },
          { from: 'application', allow: ['domain'] },
          { from: 'infrastructure', allow: ['domain', 'application', 'infrastructure'] },
          { from: 'interface', allow: ['domain', 'application', 'infrastructure'] }
        ]
      }
    ]
  },
  overrides: [
    // DOMAIN
    {
      files: ['src/modules/**/domain/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: [
                  '**/application/**',
                  '**/infrastructure/**',
                  '**/main/**',
                  '**/interface/**'
                ],
                message:
                  'Domain layer must be pure. No imports from application, infrastructure, main or interface'
              }
            ]
          }
        ]
      }
    },
    // APPLICATION
    {
      files: ['src/modules/**/application/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['**/infrastructure/**', '**/main/**'],
                message: 'Application layer should only depend on domain'
              }
            ],
            allow: ['./shared/infrastructure/graphql/resolvers'] // 👈 whitelist puntual
          }
        ]
      }
    },
    // INFRASTRUCTURE
    {
      files: ['src/modules/**/infrastructure/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['**/application/**', '**/main/**'],
                message: 'Infrastructure should not import application or main'
              }
            ]
          }
        ]
      }
    },
    // MAIN (composition root) -> allow everything
    {
      files: ['src/modules/**/main/**/*.ts'],
      rules: {
        'no-restricted-imports': 'off'
      }
    }
  ],
  settings: {
    'import/resolver': {
      node: { extensions: ['.js', '.ts'] },
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json'
      }
    },
    'boundaries/elements': [
      { type: 'domain', pattern: 'src/modules/*/domain' },
      { type: 'application', pattern: 'src/modules/*/application' },
      { type: 'infrastructure', pattern: 'src/modules/*/infrastructure' },
      { type: 'interface', pattern: 'src/modules/*/interface' }
    ]
  }
}
