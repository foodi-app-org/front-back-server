module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: 'standard',
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    camelcase: ['error', { properties: 'never', ignoreDestructuring: true }],
    // General
    'consistent-return': 'off',

    // Estilo de código
    indent: ['error', 2],
    'no-trailing-spaces': 'error',

    // Errores y buenas prácticas
    'no-console': 'error',
    'no-param-reassign': 'error',
    'no-undef': 'error',

    // Seguridad
    'no-eval': 'error',
    'no-use-before-define': 'error',

    // Manejo de errores
    'handle-callback-err': 'error',
    'no-unused-vars': 'warn',

    // Estándares y convenciones
    'arrow-body-style': ['error', 'as-needed'],
    'prefer-arrow-callback': 'error',

    // Módulos y imports
    'import/order': ['error', { 'newlines-between': 'always' }]
  }
}
