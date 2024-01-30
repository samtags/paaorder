module.exports = {
  preset: '@testing-library/react-native',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!@react-native|react-native|@react-navigation)',
  ],
};
