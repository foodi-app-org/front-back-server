module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'import',
    'simple-import-sort',
    'unused-imports'
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

    // 🚀 TypeScript
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // 🧹 Imports organizados
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    // 🔥 No dejar basura
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', argsIgnorePattern: '^_' }
    ],

    // 📦 Importaciones ordenadas
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
        'newlines-between': 'always'
      }
    ],
    // 🧠 Hexagonal: evitar imports cruzados (si quieres ir a fuego)
    // Desactiva esto si no quieres ser tan estricto
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
    }
  }

}
