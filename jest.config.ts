export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/',
    '.d.ts'
  ]
}
