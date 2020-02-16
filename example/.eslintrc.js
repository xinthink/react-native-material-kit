module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    'prettier/prettier': ['error', {
      singleQuote: true,
      trailingComma: 'es5',
      printWidth: 110,
    }],
    semi: 'off',
    'react-native/no-inline-styles': 'off',
  },
};
