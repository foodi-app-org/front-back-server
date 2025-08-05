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

    // 🧠 Hexagonal: evitar imports cruzados (si quieres ir a fuego)
    'no-restricted-imports': [
      'error',
      {
        paths: [],
        patterns: [
          {
            group: ['../../infrastructure/*', '../../interface/*'],
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
