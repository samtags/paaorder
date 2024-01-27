module.exports = {
  root: true,
  extends: '@react-native',
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
  globals: {
    NodeJS: true,
  },
};
