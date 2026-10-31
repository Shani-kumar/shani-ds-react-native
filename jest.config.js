/** @type {import('jest').Config} */
module.exports = {
  projects: [
    {
      displayName: 'tokens',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/tokens/**/*.test.ts', '<rootDir>/scripts/**/*.test.ts'],
      modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/.expo/'],
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            tsconfig: 'tsconfig.base.json',
          },
        ],
      },
    },
    {
      displayName: 'ui',
      preset: 'react-native',
      setupFiles: ['<rootDir>/jest.setup.js'],
      testMatch: ['<rootDir>/packages/ui/**/*.test.ts', '<rootDir>/packages/ui/**/*.test.tsx'],
      modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/.expo/'],
      moduleNameMapper: {
        '^@shani/tokens$': '<rootDir>/packages/tokens/src/index.ts',
        '^lucide-react-native$': require.resolve('lucide-react-native', {
          paths: [__dirname + '/packages/ui'],
        }),
      },
      transformIgnorePatterns: [
        'node_modules/(?!(\\.pnpm|((jest-)?react-native|@react-native(-community)?|react-native-reanimated|lucide-react-native|react-native-svg))/)',
      ],
    },
  ],
};
