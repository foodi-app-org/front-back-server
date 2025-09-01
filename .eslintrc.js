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
    // 💣 Limpieza
    'no-console': 'warn',
    'no-debugger': 'error',
    semi: ['error', 'never'],

    // 🚀 TypeScript
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // 🔥 No dejar basura
    'no-unused-vars': 'off', // 🔕 Desactiva la nativa de JS
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        caughtErrors: 'all',
        ignoreRestSiblings: false,
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_'
      }
    ],
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_'
      }
    ],

    // 🧹 Imports organizados
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    // 🔐 Comillas simples siempre
    quotes: ['error', 'single', { avoidEscape: true }],

    // 📦 Importaciones ordenadas
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
        'newlines-between': 'always'
      }
    ],
    // Requiere salto de línea si hay más de 2 imports en una sola línea
    'object-curly-newline': [
      'error',
      {
        ImportDeclaration: { minProperties: 3, multiline: true, consistent: true },
      },
    ],
    // 🧠 Hexagonal: evitar imports cruzados (si quieres ir a fuego)
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              // bloquea infra e interface excepto si vienen de main
              '**/!(main)/**/infrastructure/**',
              '**/!(main)/**/interface/**'
            ],
            message: 'Application layer should not import from infrastructure/interface'
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
          { from: 'infrastructure', allow: ['domain', 'application'] },
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
              '**/application/**',
              '**/infrastructure/**',
              '**/main/**',
              '**/interfaces/**', // si interfaces son adaptadores
            ],
            message: 'Domain layer must be pure. No imports from application, infrastructure, main or interfaces',
          },
        ],
      },
    },
    // APPLICATION
    {
      files: ['src/modules/**/application/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              '**/infrastructure/**',
              '**/main/**',
            ],
            message: 'Application layer should only depend on domain (entities, repos, interfaces, value-objects)',
          },
        ],
      },
    },
    // INFRASTRUCTURE
    {
      files: ['src/modules/**/infrastructure/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              '**/application/**',
              '**/main/**',
            ],
            message: 'Infrastructure should not import application or main',
          },
        ],
      },
    },
    // MAIN (factories, composition root)
    {
      files: ['src/modules/**/main/**/*.ts'],
      rules: {
        // Main puede importar todo (composition root)
        'no-restricted-imports': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts']
      },
      typescript: {
        project: './tsconfig.json'
      }
    },
    'boundaries/elements': [
      { type: 'domain', pattern: 'src/*/domain' },
      { type: 'application', pattern: 'src/*/application' },
      { type: 'infrastructure', pattern: 'src/*/infrastructure' },
      { type: 'interface', pattern: 'src/*/interface' }
    ]
  }
}
