export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'js'],

  testMatch: ['**/?(*.)+(test).ts'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },

  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },

  transformIgnorePatterns: [
    '/node_modules/(?!(uuid)/)'
  ],

  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/',
    '.d.ts'
  ]
}
