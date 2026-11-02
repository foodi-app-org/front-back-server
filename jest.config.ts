export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'js'],

  testMatch: ['**/?(*.)+(test).ts'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Mirror the tsconfig path aliases so hexagonal modules are testable.
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@api/(.*)$': '<rootDir>/src/api/$1'
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
